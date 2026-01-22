import "server-only";

import prisma from "@/lib/prisma";
import { requireUser } from "../auth";
import { serialize } from "@/lib/utils/serialize";

type DashboardSummary = {
  accountId: string;
  accountName: string;
  accountType: string;
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
  }[];
};

async function getDefaultAccountByUserId(userId: string) {
  return await prisma.account.findFirst({
    where: {
      userId: userId,
      isDefault: true,
    },
    select: {
      id: true,
      name: true,
      type: true,
      balance: true,
    },
  });
}

// get total income, total expense, recent transactions for default account
export default async function getDefaultAccountDataForDashboard(): Promise<DashboardSummary | null> {
  const user = await requireUser();

  const defaultAccount = await getDefaultAccountByUserId(user.id);

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
    accountName: defaultAccount.name,
    accountType: defaultAccount.type,
    balance: defaultAccount.balance,
    totalIncome: incomeAgg._sum.amount ?? 0,
    totalExpense: expenseAgg._sum.amount ?? 0,
    recentTransactions,
  };

  return serialize(rawResult) as DashboardSummary;
}

// get top income and expense categories for default account
type CategorySummary = {
  category: string;
  totalAmount: number;
};

export async function getTopCategoriesForDashboard() {
  const user = await requireUser();

  const defaultAccount = await getDefaultAccountByUserId(user.id);

  if (!defaultAccount)
    return {
      topIncomeCategories: [],
      topExpenseCategories: [],
    };

  const groupedData = await prisma.transaction.groupBy({
    by: ["category", "type"],
    where: {
      accountId: defaultAccount.id,
    },
    _sum: {
      amount: true,
    },
  });

  const incomeCategories: CategorySummary[] = [];
  const expenseCategories: CategorySummary[] = [];

  for (const row of groupedData) {
    const item = {
      category: row.category,
      totalAmount: Number(row._sum.amount) ?? 0,
    };

    if (row.type === "INCOME") {
      incomeCategories.push(item);
    } else if (row.type === "EXPENSE") {
      expenseCategories.push(item);
    }
  }

  return {
    topIncomeCategories: incomeCategories
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5),

    topExpenseCategories: expenseCategories
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5),
  };
}
