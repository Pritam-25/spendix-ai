import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TransactionTable from "@/components/web/TransactionTable";
import { getAllTransactions } from "@/lib/data/transactions/queries";
import ExportButton from "@/components/web/export-button";

export default async function TransactionsPage() {
  const allTransactions = await getAllTransactions();

  const handleExportAction = async () => {
    // your logic here
  };

  return (
    <div>
      <Card className="h-full">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                All Transactions
              </CardTitle>
              <CardDescription>
                Manage all your transactions accross accounts here.
              </CardDescription>
            </div>

            {/* Export button */}
            {/* <ExportButton action={handleExportAction} /> */}
          </div>
        </CardHeader>

        {/* Horizontal scroll safety for mobile */}
        <CardContent className="pt-4 overflow-x-auto">
          <TransactionTable transactions={allTransactions} showAccountColumn />
        </CardContent>
      </Card>
    </div>
  );
}
