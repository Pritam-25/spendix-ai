import "server-only";

import { Prisma, TransactionType } from "@prisma/client";
import { TransactionParsedType } from "@/lib/schemas/transaction.schema";
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
