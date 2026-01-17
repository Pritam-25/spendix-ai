import prisma from "@/lib/prisma";

export function findAccountById(accountId: string, userId: string) {
  return prisma.account.findUnique({
    where: {
      id: accountId,
      userId: userId,
    },
  });
}
