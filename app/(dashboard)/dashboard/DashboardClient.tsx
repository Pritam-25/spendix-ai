"use client";

import {
  Wallet2,
  ArrowDownRight,
  ArrowUpRight,
  PieChart as PieChartIcon,
} from "lucide-react";

import { BudgetOverviewCard } from "./_components/BudgetOverviewCard";
import { EmptyDashboard } from "./_components/EmptyDashboard";
import { ExpensesByCategoryCard } from "./_components/ExpensesByCategoryCard";
import { RecentTransactionsCard } from "./_components/RecentTransactionsCard";
import { StatCard } from "./_components/StatCard";

type RecentTransaction = {
  id: string;
  date: string;
  description: string | null;
  category: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
};

type DashboardData = {
  accountId: string;
  balance: number;
  totalIncome: number;
  totalExpense: number;
  recentTransactions: RecentTransaction[];
} | null;

export default function DashboardClient({ data }: { data: DashboardData }) {
  const hasData = !!data;

  if (!hasData) {
    return (
      <div className="space-y-6">
        <EmptyDashboard />
      </div>
    );
  }

  const balance = data.balance;
  const totalIncome = data.totalIncome;
  const totalExpense = data.totalExpense;
  const recentTransactions = data.recentTransactions;
  const accountId = data.accountId;

  const budgetUsed =
    totalIncome > 0
      ? Math.min(100, Math.round((totalExpense / totalIncome) * 100))
      : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={`₹ ${balance.toFixed(2)}`}
          icon={Wallet2}
          iconClassName="bg-amber-50 text-amber-600 dark:bg-amber-950/40"
        />
        <StatCard
          title="Total Expense"
          value={`-₹ ${totalExpense.toFixed(2)}`}
          icon={ArrowDownRight}
          iconClassName="bg-red-50 text-red-600 dark:bg-red-950/40"
          valueClassName="text-red-600 dark:text-red-400"
        />
        <StatCard
          title="Total Income"
          value={`+₹ ${totalIncome.toFixed(2)}`}
          icon={ArrowUpRight}
          iconClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40"
          valueClassName="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Budget Used"
          value={`${budgetUsed}%`}
          icon={PieChartIcon}
          iconClassName="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40"
        />
      </div>

      <BudgetOverviewCard
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        budgetUsed={budgetUsed}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RecentTransactionsCard
          accountId={accountId}
          recentTransactions={recentTransactions}
        />

        <ExpensesByCategoryCard />
      </div>
    </div>
  );
}
