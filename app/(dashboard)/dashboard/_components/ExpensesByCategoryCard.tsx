import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const placeholderExpenseByCategory = [
  { name: "Food", value: 5200 },
  { name: "Rent", value: 8000 },
  { name: "Travel", value: 3000 },
  { name: "Others", value: 2000 },
];

export function ExpensesByCategoryCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={placeholderExpenseByCategory}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
            >
              {placeholderExpenseByCategory.map((_, index) => (
                <Cell key={index} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
