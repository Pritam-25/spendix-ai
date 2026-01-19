import "server-only";

import { Prisma } from "@prisma/client";
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
