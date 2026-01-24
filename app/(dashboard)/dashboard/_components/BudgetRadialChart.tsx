"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "A radial chart showing monthly budget progress";

type RadialChartProps = {
  totalBudget: number;
  spent: number;
};

export function BudgetRadialChart({ totalBudget, spent }: RadialChartProps) {
  const percentUsed = Math.min(100, Math.round((spent / totalBudget) * 100));

  // Dynamic spent color
  const spentColor =
    percentUsed >= 90
      ? "#dc2626" // red-600
      : percentUsed >= 75
        ? "#ca8a04" // yellow-500
        : "#22c55e"; // emerald-500

  // Chart data must match RadialBar dataKeys
  const chartData = [
    {
      month: "January",
      spent,
      remaining: totalBudget - spent,
    },
  ];

  // Chart config (used by ChartContainer, optional)
  const chartConfig = {
    spent: {
      label: "Spent",
      color: spentColor,
    },
    remaining: {
      label: "Remaining",
      color: "var(--muted-foreground/20)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="h-full">
      {/* Header */}
      <CardHeader className="items-center">
        <CardTitle>Budget Progress</CardTitle>
        <CardDescription>This month’s budget progress</CardDescription>
      </CardHeader>

      {/* Chart */}
      <CardContent className="flex justify-center p-0">
        <ChartContainer
          config={chartConfig}
          className="w-full aspect-square h-[180px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={180}
            endAngle={0} // Semi-circle
            innerRadius={70}
            outerRadius={110}
          >
            {/* Optional tooltip */}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            {/* Center label */}
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 10}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {percentUsed.toLocaleString()}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 10}
                          className="fill-muted-foreground text-sm"
                        >
                          used
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>

            {/* Radial bars - draw remaining first, then spent on top */}

            <RadialBar
              dataKey="spent"
              stackId="a"
              cornerRadius={6}
              fill={spentColor}
              className="stroke-transparent"
            />
            <RadialBar
              dataKey="remaining"
              stackId="a"
              cornerRadius={6}
              fill="currentColor"
              className="text-muted-foreground/20 stroke-transparent"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex flex-col items-center pt-2">
        {/* Conditional Status Message */}
        <p className="text-sm font-semibold mb-2">
          {percentUsed <= 75
            ? "You are within a safe spending limit."
            : percentUsed <= 90
              ? "Warning: Spending is nearing the monthly budget cap."
              : "“Critical: Your spending is almost at your monthly limit"}
        </p>

        {/* Actual Spending Info */}
        <p className="text-sm text-muted-foreground">
          Spent <span className="font-semibold">₹{spent.toLocaleString()}</span>{" "}
          out of{" "}
          <span className="font-semibold">₹{totalBudget.toLocaleString()}</span>{" "}
          this month
        </p>
      </CardFooter>
    </Card>
  );
}
