import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";

import TransactionTable from "@/components/web/TransactionTable";
import ChartTable from "../_components/ChartTable";
import { getAllTransactionsByAccountId } from "@/lib/data/accounts/queries";
import ExportButton from "@/components/web/export-button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { AccountAnalyticsSkeleton } from "../_components/AccountAnalyticsSkeleton";
import { ExportFormat } from "@/lib/data/exports/export.data";
import { exportAccountTransactionAction, ExportActionResult } from "../action";

interface AccountTransactionFromProps {
  params: Promise<{ id: string }>;
}

const AccountTransactionPage = async ({
  params,
}: AccountTransactionFromProps) => {
  const { id } = await params;

  const accountData = await getAllTransactionsByAccountId(id);
  if (!accountData) {
    notFound();
  }

  const { account, transactions } = accountData;

  // ✅ Server action wrapper (typed + serializable)
  async function handleExportAction(
    format: ExportFormat,
  ): Promise<ExportActionResult> {
    "use server";
    return exportAccountTransactionAction(id, format);
  }

  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<AccountAnalyticsSkeleton />}>
        {/* ✅ Responsive grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)]">
          {/* ================= LEFT SIDE ================= */}
          <div className="flex flex-col gap-4">
            {/* Account Header */}
            <div className="rounded-xl border bg-gradient-to-br from-background to-muted px-4 py-4 md:px-6 md:py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: account info */}
                <div className="flex items-start gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="h-8 w-8"
                  >
                    <Link href="/accounts">
                      <ArrowLeft className="h-4 w-4" />
                      <span className="sr-only">Back to accounts</span>
                    </Link>
                  </Button>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
                        {account.name}
                      </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="rounded-full bg-muted px-2 py-0.5">
                        {account.type === "CURRENT"
                          ? "Current account"
                          : "Savings account"}
                      </span>

                      {account.isDefault && (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                          Default account
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: balance */}
                <div className="flex flex-col gap-2 sm:items-end sm:text-right">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    balance
                  </span>

                  <span className="text-2xl font-semibold text-emerald-400">
                    ₹ {Number(account.balance).toFixed(2)}
                  </span>

                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                    {account.totalTransactions} transactions
                  </span>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="min-h-[280px] sm:min-h-[320px]">
              <ChartTable transactions={transactions} />
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <Card className="h-full">
            <CardHeader className="border-b">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Transactions
                  </CardTitle>
                  <CardDescription>
                    Search, filter, and review all activity for this account.
                  </CardDescription>
                </div>

                <ExportButton action={handleExportAction} />
              </div>
            </CardHeader>

            {/* ✅ Horizontal scroll safety for mobile */}
            <CardContent className="pt-4 overflow-x-auto">
              <TransactionTable transactions={transactions} />
            </CardContent>
          </Card>
        </div>
      </Suspense>
    </div>
  );
};

export default AccountTransactionPage;
