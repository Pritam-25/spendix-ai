"use server";

import { requireUser } from "@/lib/dal/auth";
import { transactionSchema } from "@/lib/schemas/transaction.schema";
import { request } from "@arcjet/next";
import { aj } from "@/lib/arcjet";
import { findAccountById } from "@/lib/dal/transaction";
import prisma from "@/lib/prisma";
import { createTransactionService } from "@/lib/services/transaction.service";
import { revalidatePath } from "next/cache";
import { requireRecurringTransactions } from "@/lib/access/guard";
import { ErrorCode } from "@/lib/errors/error-codes";
import { mapDomainError } from "@/lib/errors/mapDomainError";

type ResponseResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function createTransaction(
  data: unknown,
): Promise<ResponseResult> {
  const parsed = transactionSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error(ErrorCode.INVALID_FORM_DATA);
  }

  try {
    const { accountId } = parsed.data;

    const user = await requireUser();

    // 🔐 PRO FEATURE CHECK
    if (parsed.data.isRecurring) {
      await requireRecurringTransactions();
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

    await prisma.$transaction((tx) =>
      createTransactionService({
        prisma: tx,
        userId: user.id,
        account: { id: account.id, balance: account.balance },
        data: parsed.data,
      }),
    );

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
