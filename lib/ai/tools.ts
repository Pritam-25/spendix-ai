import { tool } from "@langchain/core/tools";
import { Command } from "@langchain/langgraph";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/data/users/auth";

/* ----------------------------------------
   Helpers
----------------------------------------- */
function decimalToNumber(value: Prisma.Decimal | number | null | undefined) {
  if (value instanceof Prisma.Decimal) {
    return Number(value.toString());
  }
  return value ?? 0;
}

/* ----------------------------------------
   Gemini requires strict schemas
----------------------------------------- */
const FetchLastMonthExpenseSchema = z.object({}).strict();

/* ----------------------------------------
   Tool: Last month total expense
----------------------------------------- */
export const fetchLastMonthExpenseTool = tool(
  async (_input: z.infer<typeof FetchLastMonthExpenseSchema>, config) => {
    try {
      console.log("🛠️ [Tool] fetch_last_month_expense called");

      // ✅ Centralized auth (Clerk + DB)
      const user = await requireUser();

      const base = subMonths(new Date(), 1);
      const start = startOfMonth(base);
      const end = endOfMonth(base);

      const transactions = await prisma.transaction.findMany({
        where: {
          userId: user.id,
          type: "EXPENSE",
          date: {
            gte: start,
            lte: end,
          },
        },
        select: { amount: true },
      });

      const totalExpense = transactions.reduce(
        (sum, tx) => sum + decimalToNumber(tx.amount),
        0,
      );

      const result = {
        timeframe: "last_month",
        start: start.toISOString(),
        end: end.toISOString(),
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
              content: `Error fetching last month's expense: ${error instanceof Error ? error.message : "Unknown error"}`,
              tool_call_id: config.toolCall?.id,
            },
          ],
        },
      });
    }
  },
  {
    name: "fetch_last_month_expense",
    description: "Get the user's total EXPENSE for last month",
    schema: FetchLastMonthExpenseSchema,
  },
);

/* ----------------------------------------
   Export Spendix tools
----------------------------------------- */
export const spendixTools = [fetchLastMonthExpenseTool];
