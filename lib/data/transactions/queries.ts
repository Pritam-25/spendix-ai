import "server-only";

import prisma from "@/lib/prisma";
import { requireUser } from "../users/auth";

export function findAccountById(accountId: string, userId: string) {
  return prisma.account.findUnique({
    where: {
      id: accountId,
      userId: userId,
    },
  });
}

export async function getTransactionById(transactionId: string) {
  const user = await requireUser();

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId: user.id,
    },
  });

  return transaction;
}
