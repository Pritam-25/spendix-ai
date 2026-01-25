"use server";

import { requireUser } from "@/lib/data/users/auth";
import { transactionSchema } from "@/lib/schemas/transaction.schema";
import { request } from "@arcjet/next";
import { aj } from "@/lib/arcjet";
import { revalidatePath } from "next/cache";
import { ErrorCode } from "@/lib/constants/error-codes";
import { mapDomainError } from "@/lib/utils/mapDomainError";
import { findAccountById } from "@/lib/data/transactions/queries";
import {
  createTransaction,
  updateTransaction,
} from "@/lib/data/transactions/mutations";
import { bulkDeleteTransactions } from "@/lib/data/transactions/mutations";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { requireFeature } from "@/lib/data/users/subscription";
import { FEATURES } from "@/lib/config/features";
import {
  guardAiReceiptScan,
  incrementAiReceiptUsage,
} from "@/lib/data/users/usages";
import { EXPENSE_CATEGORIES } from "@/lib/constants/categories";

type ResponseResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function createTransactionAction(
  data: unknown,
): Promise<ResponseResult> {
  const parsed = transactionSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: ErrorCode.INVALID_FORM_DATA };
  }

  try {
    const { accountId } = parsed.data;

    const user = await requireUser();

    // 🔐 PRO FEATURE CHECK
    if (parsed.data.isRecurring) {
      await requireFeature(FEATURES.RECURRING_TRANSACTIONS);
    }

    // arcjet
    const req = await request();
    const decision = await aj.protect(req, {
      userId: user.id,
      requested: 1,
    });

    if (decision.isDenied()) {
      throw new Error(ErrorCode.RATE_LIMITED);
    }

    const account = await findAccountById(accountId, user.id);

    if (!account) {
      throw new Error(ErrorCode.ACCOUNT_NOT_FOUND);
    }

    await createTransaction({
      userId: user.id,
      account: { id: account.id, balance: account.balance },
      data: parsed.data,
    });
    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    revalidatePath(`/accounts/${account.id}`);

    return {
      success: true,
      message: "Transaction created successfully",
    };
  } catch (error) {
    // Map known domain errors
    const mapped = mapDomainError(error);

    if (mapped) {
      return { success: false, error: mapped.error };
    }

    // If error is unknown, use TRANSACTION_CREATION_FAILED
    return { success: false, error: ErrorCode.TRANSACTION_CREATION_FAILED };
  }
}

// Bulk delete transactions for the Transactions dashboard
export async function bulkDeleteTransactionAction(
  transactionIds: string[],
): Promise<ResponseResult> {
  try {
    const user = await requireUser();

    await bulkDeleteTransactions({ userId: user.id, transactionIds });

    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    revalidatePath("/accounts/[id]", "page");

    return { success: true, message: "Transactions deleted successfully" };
  } catch (error) {
    const mapped = mapDomainError(error);
    if (mapped) {
      return { success: false, error: mapped.error };
    }
    return { success: false, error: ErrorCode.TRANSACTION_DELETE_FAILED };
  }
}

// update transaction
export async function updateTransactionAction(
  transactionId: string,
  data: unknown,
): Promise<ResponseResult> {
  const parsed = transactionSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(ErrorCode.INVALID_FORM_DATA);
  }

  try {
    const user = await requireUser();

    // pro feature check
    if (parsed.data.isRecurring) {
      await requireFeature(FEATURES.RECURRING_TRANSACTIONS);
    }

    await updateTransaction({
      id: transactionId,
      userId: user.id,
      data: parsed.data,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/accounts/${parsed.data.accountId}`, "page");
    revalidatePath("/transactions");

    return {
      success: true,
      message: "Transaction updated successfully",
    };
  } catch (error) {
    const mapped = mapDomainError(error);
    if (mapped) {
      return { success: false, error: mapped.error };
    }
    return { success: false, error: ErrorCode.TRANSACTION_UPDATE_FAILED };
  }
}

// ai scan reciept action
const receiptSchema = z.object({
  amount: z.number().positive(),
  date: z.string(),
  description: z.string(),
  merchantName: z.string(),
  category: z.string(),
});

type AiReceiptScanResult =
  | {
      success: true;
      data: {
        amount: number;
        date: Date;
        description: string;
        category: string;
      };
      message: string;
    }
  | { success: false; error: string };

export async function aiScanReceiptAction(
  file: File,
): Promise<AiReceiptScanResult> {
  try {
    const user = await requireUser();

    // usage guard
    await guardAiReceiptScan(user.id);

    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

    if (!apiKey) {
      throw new Error("Gemini API key is not defined");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    const prompt = `
This image contains EXACTLY ONE receipt for ONE transaction.

STRICT RULES:
- If more than ONE transaction, table, or receipt is visible → return []

Extract ONLY if exactly one transaction exists:
- Total amount
- Date
- Description
- Merchant name
- Category (choose one: ${EXPENSE_CATEGORIES.join(", ")})

Return ONLY valid JSON.

Valid receipt:
{
  "amount": number,
  "date": "YYYY-MM-DD",
  "description": "string",
  "merchantName": "string",
  "category": "string"
}

Multiple transactions:
[]
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: file.type,
          data: base64,
        },
      },
    ]);

    // ✅ JSON only (no regex needed)
    const text = result.response.text();
    const parsed = JSON.parse(text);

    // 🚫 MULTIPLE RECEIPTS (explicit signal)
    if (Array.isArray(parsed) && parsed.length === 0) {
      throw new Error(ErrorCode.BULK_RECEIPT_NOT_ALLOWED);
    }

    // 🚫 Any array is invalid
    if (Array.isArray(parsed)) {
      throw new Error(ErrorCode.BULK_RECEIPT_NOT_ALLOWED);
    }

    // 🚫 Unreadable / failed extraction
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      Object.keys(parsed).length === 0
    ) {
      throw new Error(ErrorCode.RECEIPT_UNREADABLE);
    }

    const validated = receiptSchema.parse({
      ...parsed,
      amount: Number(parsed.amount),
    });

    let description = validated.description;
    if (validated.merchantName) {
      description = `${validated.merchantName} - ${validated.description}`;
    }

    // ✅ increment only on success
    await incrementAiReceiptUsage(user.id);

    return {
      success: true,
      message: "Receipt scanned successfully",
      data: {
        amount: validated.amount,
        date: new Date(validated.date),
        description,
        category: validated.category,
      },
    };
  } catch (error) {
    console.error("Receipt scanning failed:", error);

    const mapped = mapDomainError(error);
    if (mapped) {
      return { success: false, error: mapped.error };
    }

    if (error instanceof Error) {
      if (error.message.includes("404")) {
        throw new Error("Gemini model unavailable");
      }
      if (error.message.includes("429")) {
        throw new Error("Too many requests");
      }
      if (error.message.includes("413")) {
        throw new Error("Image too large");
      }
      throw error;
    }

    throw new Error("Failed to scan receipt");
  }
}

type AiBulkReceiptScanResult =
  | {
      success: true;
      message: string;
      data: {
        transactions: {
          amount: number;
          date: Date;
          description: string;
          category: string;
        }[];
      };
    }
  | {
      success: false;
      error: string;
    };

const bulkReceiptSchema = z.object({
  transactions: z
    .array(
      z.object({
        amount: z.number().positive(),
        date: z.string(),
        description: z.string(),
        category: z.enum(EXPENSE_CATEGORIES),
      }),
    )
    .min(1),
});

export async function aiBulkReceiptScan(
  file: File,
): Promise<AiBulkReceiptScanResult> {
  try {
    await requireUser();

    // check premium feature ai bulk receipt scan
    await requireFeature(FEATURES.AI_BULK_INSERT);

    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

    if (!apiKey) {
      throw new Error("Gemini API key is not defined");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    const prompt = `
This image may contain MULTIPLE receipts or transactions.

GOAL:
- Extract ALL visible transactions.
- Each transaction must be independent.

RULES:
- If NO valid transactions are detected → return []
- Do NOT merge transactions.
- Do NOT hallucinate missing values.

Return ONLY valid JSON.

{
  "transactions": [
    {
      "amount": number,
      "date": "YYYY-MM-DD",
      "description": "string",
      "category": "${EXPENSE_CATEGORIES.join(" | ")}"
    }
  ]
}
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: file.type,
          data: base64,
        },
      },
    ]);

    // ✅ JSON only
    const parsed = JSON.parse(result.response.text());

    // 🚫 No transactions found
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !Array.isArray(parsed.transactions) ||
      parsed.transactions.length === 0
    ) {
      throw new Error(ErrorCode.NO_TRANSACTIONS_FOR_BULK_SCAN);
    }

    // ✅ Validate structure
    const validated = bulkReceiptSchema.parse(parsed);

    const transactions = validated.transactions.map((tx) => ({
      amount: tx.amount,
      date: new Date(tx.date),
      description: tx.description,
      category: tx.category,
    }));

    return {
      success: true,
      message: `${transactions.length} transactions scanned successfully`,
      data: { transactions },
    };
  } catch (error) {
    console.error("Bulk receipt scanning failed:", error);

    const mapped = mapDomainError(error);
    if (mapped) {
      return { success: false, error: mapped.error };
    }

    if (error instanceof Error) {
      if (error.message.includes("404")) {
        throw new Error("Gemini model unavailable");
      }
      if (error.message.includes("429")) {
        throw new Error("Too many requests");
      }
      if (error.message.includes("413")) {
        throw new Error("Image too large");
      }
      throw error;
    }

    throw new Error("Failed to scan bulk receipts");
  }
}
