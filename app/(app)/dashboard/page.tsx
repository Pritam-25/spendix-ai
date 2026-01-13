"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const summary = {
  balance: 42300,
  expense: 18200,
  income: 32000,
  budgetUsed: 61,
};

const recentTransactions = [
  { id: 1, name: "Zomato", amount: -420 },
  { id: 2, name: "Rent", amount: -8000 },
  { id: 3, name: "Salary", amount: 32000 },
  { id: 4, name: "Uber", amount: -250 },
  { id: 5, name: "Netflix", amount: -499 },
];

const expenseByCategory = [
  { name: "Food", value: 5200 },
  { name: "Rent", value: 8000 },
  { name: "Travel", value: 3000 },
  { name: "Others", value: 2000 },
];

type StatCardProps = {
  title: string;
  value: string;
};

function StatCard({ title, value }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const hasData = false;

  return (
    <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>

      {!hasData ? (
        <EmptyDashboard />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Balance" value={`₹${summary.balance}`} />
            <StatCard title="This Month Expense" value={`-₹${summary.expense}`} />
            <StatCard title="This Month Income" value={`+₹${summary.income}`} />
            <StatCard title="Budget Used" value={`${summary.budgetUsed}%`} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                ₹18,200 of ₹30,000 used
              </p>
              <Progress value={summary.budgetUsed} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Button variant="ghost">View all</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span>{tx.name}</span>
                    <span
                      className={
                        tx.amount < 0 ? "text-red-500" : "text-green-500"
                      }
                    >
                      {tx.amount < 0 ? "-" : "+"}₹{Math.abs(tx.amount)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                    >
                      {expenseByCategory.map((_, index) => (
                        <Cell key={index} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function EmptyDashboard() {
  return (
    <Card className="mt-8">
      <CardContent className="py-20 flex flex-col items-center text-center gap-4">
        <div className="text-5xl">👋</div>
        <h2 className="text-xl font-semibold">Welcome to Spendix</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          You haven’t added any data yet. Start by creating an account and adding
          your first transaction to track your finances.
        </p>
        <div className="flex gap-3 mt-4">
          <Button>+ Add Account</Button>
          <Button variant="outline">+ Add Transaction</Button>
        </div>
      </CardContent>
    </Card>
  );
}
