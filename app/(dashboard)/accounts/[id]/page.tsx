import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2 } from "lucide-react";

import TransactionTable from "@/components/web/TransactionTable";
import ChartTable from "../_components/ChartTable";
import { getAllTransactionsByAccountId } from "@/lib/data/accounts/queries";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AccountTransactionPageProps {
  params: Promise<{ id: string }>;
}

const AccountTransactionPage = async ({
  params,
}: AccountTransactionPageProps) => {
  const { id } = await params;

  const accountData = await getAllTransactionsByAccountId(id);

  if (!accountData) {
    notFound();
  }

  const { account, transactions } = accountData;

  return (
    <div className="flex flex-col gap-6">
      {/* Main layout: left = account details + chart, right = transactions table */}
      <Suspense
        fallback={
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            Loading account analytics...
          </div>
        }
      >
        <div className="grid gap-6 items-stretch xl:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)]">
          {/* Left: account details header + chart, as you designed */}
          <div className="flex h-full flex-col gap-4">
            <div className="rounded-xl border bg-gradient-to-br from-background to-muted px-4 py-4 md:px-6 md:py-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
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
                      <h1 className="text-xl font-semibold tracking-tight">
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
                <div className="flex flex-col items-end gap-2 text-right">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    balance
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold text-emerald-400">
                      ${Number(account.balance).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-0.5">
                      {account.totalTransactions} transactions
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <ChartTable transactions={transactions} />
            </div>
          </div>

          {/* Right: transactions table */}
          <Card className="h-full">
            <CardHeader className="border-b">
              <CardTitle className="text-base font-semibold">
                Transactions
              </CardTitle>
              <CardDescription>
                Search, filter, and review all activity for this account.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <TransactionTable transactions={transactions} />
            </CardContent>
          </Card>
        </div>
      </Suspense>
    </div>
  );
};

export default AccountTransactionPage;
