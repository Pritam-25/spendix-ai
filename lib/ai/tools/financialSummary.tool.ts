import { tool } from "@langchain/core/tools";
import { Command } from "@langchain/langgraph";
import { z } from "zod";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/data/users/auth";
import { decimalToNumber, normalizeCustomDates } from "./helper";

/* ----------------------------------------
   Helpers
----------------------------------------- */

/* ----------------------------------------
   Zod Schema for Tool Input Validation
----------------------------------------- */
const FinancialSummarySchema = z
  .object({
    type: z.enum(["EXPENSE", "INCOME", "BOTH"]),
    timeframe: z.enum(["LAST_WEEK", "LAST_MONTH", "LAST_YEAR", "CUSTOM"]),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.timeframe === "CUSTOM") {
      if (!data.startDate || !data.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "startDate and endDate are required for CUSTOM timeframe",
        });
      }
    }
  });

/* ----------------------------------------
   Tool: Financial Summary
----------------------------------------- */
export const financialSummaryTool = tool(
  async (input: z.infer<typeof FinancialSummarySchema>, config) => {
    try {
      console.log("🛠️ [Tool] financial_summary called");

      //  Centralized auth (Clerk + DB)
      const user = await requireUser();

      const { type, timeframe, startDate, endDate } = input;

      const now = new Date();
      let start: Date;
      let end: Date;

      switch (timeframe) {
        case "LAST_WEEK":
          start = subWeeks(now, 1);
          end = now;
          break;

        case "LAST_MONTH":
          const base = subMonths(now, 1);
          start = startOfMonth(base);
          end = endOfMonth(base);
          break;

        case "LAST_YEAR":
          start = subYears(now, 1);
          end = now;
          break;

        case "CUSTOM":
          const normalized = normalizeCustomDates(
            new Date(startDate!),
            new Date(endDate!),
          );
          start = normalized.start;
          end = normalized.end;
          break;

        default:
          throw new Error(`Unsupported timeframe: ${timeframe}`);
      }

      console.log("📅 Interpreted range:", { start, end });

      const where: any = {
        userId: user.id,
        date: { gte: start, lte: end },
        ...(type !== "BOTH" ? { type } : {}),
      };

      const transactions = await prisma.transaction.findMany({
        where,
        select: { amount: true, type: true },
      });

      let totalIncome = 0;
      let totalExpense = 0;

      for (const tx of transactions) {
        const amount = decimalToNumber(tx.amount);
        tx.type === "INCOME"
          ? (totalIncome += amount)
          : (totalExpense += amount);
      }

      const result = {
        timeframe,
        start: start.toISOString(),
        end: end.toISOString(),
        totalIncome,
        totalExpense,
      };

      console.log("✅ Tool result:", result);

      // Return Command to update graph state
      return new Command({
        update: {
          messages: [
            {
              role: "tool",
              content: JSON.stringify(result),
              tool_call_id: config.toolCall?.id,
            },
          ],
        },
      });
    } catch (error) {
      console.error("❌ Tool error:", error);

      // Return error as Command
      return new Command({
        update: {
          messages: [
            {
              role: "tool",
              content: `Error fetching financial summary: ${error instanceof Error ? error.message : "Unknown error"}`,
              tool_call_id: config.toolCall?.id,
            },
          ],
        },
      });
    }
  },
  {
    name: "financial_summary",
    description:
      "Get a summary of the user's financial transactions over a specified timeframe.",
    schema: FinancialSummarySchema,
  },
);
