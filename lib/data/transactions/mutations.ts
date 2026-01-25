import "server-only";

import { Prisma, TransactionType } from "@prisma/client";
import {
  BulkTransactionParsedType,
  TransactionParsedType,
} from "@/lib/schemas/transaction.schema";
import { calculateNextRecurringDate } from "@/lib/utils/recurring";
import { ErrorCode } from "@/lib/constants/error-codes";
import prisma from "@/lib/prisma";

type CreateTransactionProps = {
  userId: string;
  account: { id: string; balance: Prisma.Decimal };
  data: TransactionParsedType;
};

type updateTransactonProps = {
  id: string;
  userId: string;
  data: TransactionParsedType;
};

type bulkDeleteTransactionProps = {
  userId: string;
  transactionIds: string[];
};

export async function createTransaction({
  userId,
  account,
  data,
}: CreateTransactionProps) {
  return prisma.$transaction(async (tx) => {
    const balanceChange = data.type === "INCOME" ? data.amount : -data.amount;

    // calculate new balance
    const newBalance = account.balance.add(balanceChange);

    if (newBalance.lessThan(0)) {
      throw new Error(ErrorCode.INSUFFICIENT_BALANCE);
    }

    // calculate next recurring date
    const nextRecurringDate =
      data.isRecurring && data.recurringInterval
        ? calculateNextRecurringDate(data.date, data.recurringInterval)
        : null;

    // create transaction
    const transaction = await tx.transaction.create({
      data: {
        ...data,
        userId,
        nextRecurringDate,
      },
    });

    // update account balance
    await tx.account.update({
      where: { id: account.id },
      data: {
        balance: newBalance,
      },
    });

    return transaction;
  });
}

export async function updateTransaction({
  id,
  userId,
  data,
}: updateTransactonProps) {
  // get existing transaction
  return prisma.$transaction(async (tx) => {
    const existingTransaction = await tx.transaction.findFirst({
      where: { id, userId },
      include: { account: true },
    });

    if (!existingTransaction) {
      throw new Error(ErrorCode.TRANSACTION_NOT_FOUND);
    }

    // calculate balance changes
    const oldBalanceChange =
      existingTransaction.type === "INCOME"
        ? existingTransaction.amount
        : existingTransaction.amount.neg();

    const newBalanceChange =
      data.type === "INCOME"
        ? new Prisma.Decimal(data.amount)
        : new Prisma.Decimal(data.amount).neg();

    const balanceDifference = newBalanceChange.sub(oldBalanceChange);

    const newBalance =
      existingTransaction.account.balance.add(balanceDifference);

    if (newBalance.lessThan(0)) {
      throw new Error(ErrorCode.INSUFFICIENT_BALANCE);
    }

    // update transaction
    const updatedTransaction = await tx.transaction.update({
      where: { id },
      data: {
        ...data,
        accountId: existingTransaction.accountId, // prevent changing account
        nextRecurringDate:
          data.isRecurring && data.recurringInterval
            ? calculateNextRecurringDate(data.date, data.recurringInterval)
            : null,
      },
    });

    // update account balance
    await tx.account.update({
      where: { id: existingTransaction.accountId },
      data: {
        balance: newBalance,
      },
    });

    return updatedTransaction;
  });
}

// bulk delete transactions
export async function bulkDeleteTransactions({
  transactionIds,
  userId,
}: bulkDeleteTransactionProps) {
  // fetch transactions to verify ownership
  const transactions = await prisma.transaction.findMany({
    where: {
      id: { in: transactionIds },
      userId,
    },
  });

  if (transactions.length === 0) {
    throw new Error(ErrorCode.TRANSACTION_NOT_FOUND);
  }

  // Calculate balance changes per account

  /*
      Example result:
      {
        "account_1": 200,
        "account_2": -300
      }
    */

  const accountBalanceChanges: Record<string, Prisma.Decimal> = {};

  for (const tx of transactions) {
    const amount = tx.type === TransactionType.EXPENSE ? tx.amount : -tx.amount;

    accountBalanceChanges[tx.accountId] = (
      accountBalanceChanges[tx.accountId] || new Prisma.Decimal(0)
    ).plus(amount);
  }

  // Run delete + balance update inside a DB transaction
  // This ensures data consistency (all succeed or all rollback)

  await prisma.$transaction(async (tx) => {
    // Delete transactions
    await tx.transaction.deleteMany({
      where: {
        id: { in: transactionIds },
        userId,
      },
    });

    // Update account balances in parallel
    await Promise.all(
      Object.entries(accountBalanceChanges).map(([accountId, balanceChange]) =>
        tx.account.update({
          where: { id: accountId, userId },
          data: {
            balance: {
              increment: balanceChange,
            },
          },
        }),
      ),
    );
  });
}

// ------------------------------------------------//
function normalizeDescription(text?: string | null) {
  return (text ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}


function calculateNet(rows: BulkTransactionParsedType) {
  return rows.reduce((sum, t) => {
    return t.type === "INCOME"
      ? sum.add(t.amount)
      : sum.sub(t.amount);
  }, new Prisma.Decimal(0));
}

export async function saveBulkTransactions(
  userId: string,
  rows: BulkTransactionParsedType,
) {
  return await prisma.$transaction(async (tx) => {
    const accountId = rows[0].accountId;

    // 🔍 find existing (possible duplicates)
    const existing = await tx.transaction.findMany({
      where: {
        userId,
        accountId,
        OR: rows.map((r) => ({
          date: r.date,
          amount: r.amount,
          description: normalizeDescription(r.description),
        })),
      },
      select: {
        date: true,
        amount: true,
        description: true,
      },
    });

    const existingSet = new Set(
      existing.map(
        (e) =>
          `${e.date.toISOString()}-${e.amount.toString()}-${normalizeDescription(e.description)}`,
      ),
    );

    // 🧹 keep only new rows
    const newRows = rows.filter(
      (r) =>
        !existingSet.has(
          `${r.date.toISOString()}-${r.amount.toString()}-${normalizeDescription(r.description)}`,
        ),
    );

    if (newRows.length === 0) return;

    // 📥 insert only new transactions
    await tx.transaction.createMany({
      data: newRows.map((r) => ({
        userId,
        accountId,
        type: r.type,
        amount: r.amount,
        description: normalizeDescription(r.description),
        date: r.date,
        category: r.category,
        isRecurring: r.recurring !== "NONE",
        recurringInterval: r.recurring === "NONE" ? null : r.recurring,
      })),
    });

    // 💰 update balance only for inserted rows
    const netBalanceChange = calculateNet(newRows);

    await tx.account.update({
      where: { id: accountId, userId },
      data: {
        balance: {
          increment: netBalanceChange,
        },
      },
    });
  });
}

