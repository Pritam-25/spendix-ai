"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartTooltip,
} from "recharts";

const dummyTransactions = [
  {
    date: "Jan 20, 2026",
    description: "Going to gym eat chicken egg soya paneer",
    category: "Utilities",
    amount: -241.63,
  },
  {
    date: "Jan 20, 2026",
    description: "Google Pay cashback",
    category: "Cashback",
    amount: 1000,
  },
  {
    date: "Jan 20, 2026",
    description: "Freelance work",
    category: "Freelance",
    amount: 5000,
  },
  { date: "Jan 20, 2026", description: "-", category: "Housing", amount: -500 },
];

const expenseData = [
  { name: "Utilities", value: 241.63, color: "#3B82F6" }, // blue
  { name: "Housing", value: 500, color: "#EF4444" }, // red
  { name: "Other", value: 0, color: "#6B7280" }, // gray
];

export default function Dashboard() {
  const totalBalance = 55258.37;
  const totalExpense = 741.63;
  const totalIncome = 6000;
  const budgetUsed = 12; // in %

  return (
    <div className="p-6 space-y-6 text-white bg-black min-h-screen">
      {/* Top cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-800 rounded-lg shadow-md">
          <p className="text-sm text-gray-400">Total Balance</p>
          <p className="text-2xl font-bold">
            ₹ {totalBalance.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg shadow-md">
          <p className="text-sm text-gray-400">Total Expense</p>
          <p className="text-2xl font-bold text-red-500">
            -₹ {totalExpense.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg shadow-md">
          <p className="text-sm text-gray-400">Total Income</p>
          <p className="text-2xl font-bold text-green-500">
            +₹ {totalIncome.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg shadow-md">
          <p className="text-sm text-gray-400">Budget Used</p>
          <p className="text-2xl font-bold">{budgetUsed}%</p>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="p-4 bg-gray-800 rounded-lg shadow-md">
        <p className="text-sm font-medium mb-1">Budget Overview</p>
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-3 bg-green-500 rounded-full"
            style={{ width: `${budgetUsed}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">
          ₹ {totalExpense} of ₹ {totalIncome} used
        </p>
      </div>

      {/* Recent Transactions + Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transactions Table */}
        <div className="bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold">Recent Transactions</p>
            <button className="text-green-500 text-sm">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Description</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {dummyTransactions.map((t, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-700 hover:bg-gray-700 transition"
                  >
                    <td className="py-2">{t.date}</td>
                    <td
                      className="py-2 max-w-xs truncate"
                      title={t.description}
                    >
                      {t.description}
                    </td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${t.amount >= 0 ? "bg-green-500/30 text-green-400" : "bg-red-500/30 text-red-400"}`}
                      >
                        {t.category}
                      </span>
                    </td>
                    <td
                      className={`py-2 font-medium ${t.amount >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {t.amount >= 0
                        ? `+₹ ${t.amount}`
                        : `-₹ ${Math.abs(t.amount)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses Pie Chart */}
        <div className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center justify-center">
          <p className="font-semibold mb-2">Expenses by Category</p>
          <div className="w-full h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={expenseData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartTooltip
                  formatter={(value: number | undefined) => `₹ ${value ?? 0}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
