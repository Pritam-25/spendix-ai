import "server-only";

import prisma from "@/lib/prisma";
import { AccountType, Prisma, TransactionType } from "@prisma/client";
import { ErrorCode } from "../../constants/error-codes";

type CreateAccountServiceProps = {
  userId: string;
  name: string;
  type: AccountType;
  balance: Prisma.Decimal;
  isDefault: boolean;
};

type UpdateDefaultAccountServiceProps = {
  userId: string;
  accountId: string;
};

type DeleteAccountServiceProps = {
  userId: string;
  accountId: string;
};

type BulkDeleteAccountsServiceProps = {
  userId: string;
  transactionIds: string[];
};

// create a new account
export async function createAccount({
  userId,
  name,
  type,
  balance,
  isDefault,
}: CreateAccountServiceProps) {
  // Check balance validity
  if (balance.isNaN() || balance.lessThan(0)) {
    throw new Error(ErrorCode.INVALID_BALANCE);
  }

  const existingAccounts = await prisma.account.count({ where: { userId } });
  const shouldDefaultAccount = existingAccounts === 0 ? true : isDefault;

  if (shouldDefaultAccount) {
    await prisma.account.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  const account = await prisma.account.create({
    data: {
      name,
      type,
      balance,
      isDefault: shouldDefaultAccount,
      userId,
    },
  });

  return account;
}

// update default account
export async function updateDefaultAccount({
  userId,
  accountId,
}: UpdateDefaultAccountServiceProps) {
  await prisma.$transaction([
    prisma.account.updateMany({
      where: { userId },
      data: { isDefault: false },
    }),
    prisma.account.update({
      where: {
        id: accountId,
        userId, // ownership check
      },
      data: { isDefault: true },
    }),
  ]);
}

// delete an account
export async function deleteAccount({
  userId,
  accountId,
}: DeleteAccountServiceProps) {
  await prisma.$transaction(async (tx) => {
    const account = await tx.account.findFirst({
      where: { id: accountId, userId },
    });
    if (!account) throw new Error(ErrorCode.ACCOUNT_NOT_FOUND);

    if (account.isDefault) {
      const anotherDefault = await tx.account.findFirst({
        where: { userId, id: { not: accountId }, isDefault: true },
      });
      if (!anotherDefault) throw new Error(ErrorCode.LAST_DEFAULT_ACCOUNT);
    }

    await tx.account.deleteMany({ where: { id: accountId, userId } });
  });
}

// bulk delete transactions
export async function bulkDeleteTransactions({
  transactionIds,
  userId,
}: BulkDeleteAccountsServiceProps) {
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
