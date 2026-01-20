import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type BudgetOverviewCardProps = {
  totalIncome: number;
  totalExpense: number;
  budgetUsed: number;
};

export function BudgetOverviewCard({
  totalIncome,
  totalExpense,
  budgetUsed,
}: BudgetOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          ₹ {totalExpense.toFixed(2)} of ₹ {totalIncome.toFixed(2)} used
        </p>
        <Progress value={budgetUsed} />
      </CardContent>
    </Card>
  );
}
