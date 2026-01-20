import "server-only";

import prisma from "@/lib/prisma";
import { requireUser } from "../auth";
import { serialize } from "@/lib/utils/serialize";

type DashboardSummary = {
  accountId: string;
  balance: number;
  totalIncome: number;
  totalExpense: number;
  recentTransactions: {
    id: string;
    date: string;
    type: "INCOME" | "EXPENSE";
    category: string;
    amount: number;
    description: string | null;
    // add any other fields you actually use in the UI
  }[];
};

export default async function getDefaultAccountDataForDashboard(): Promise<DashboardSummary | null> {
  const user = await requireUser();

  const defaultAccount = await prisma.account.findFirst({
    where: {
      userId: user.id,
      isDefault: true,
    },
    select: {
      id: true,
      balance: true,
    },
  });

  if (!defaultAccount) return null;

  const [incomeAgg, expenseAgg, recentTransactions] = await prisma.$transaction(
    [
      prisma.transaction.aggregate({
        where: {
          accountId: defaultAccount.id,
          type: "INCOME",
        },
        _sum: { amount: true },
      }),

      prisma.transaction.aggregate({
        where: {
          accountId: defaultAccount.id,
          type: "EXPENSE",
        },
        _sum: { amount: true },
      }),

      prisma.transaction.findMany({
        where: {
          accountId: defaultAccount.id,
        },
        orderBy: {
          date: "desc",
        },
        select: {
          id: true,
          date: true,
          description: true,
          type: true,
          amount: true,
          category: true,
        },
        take: 5,
      }),
    ],
  );

  const rawResult = {
    accountId: defaultAccount.id,
    balance: defaultAccount.balance,
    totalIncome: incomeAgg._sum.amount ?? 0,
    totalExpense: expenseAgg._sum.amount ?? 0,
    recentTransactions,
  };

  return serialize(rawResult) as DashboardSummary;
}
