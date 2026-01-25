"use client";

import { useState } from "react";
import AiBulkReceiptScanner from "./_components/AiBulkRecieptScan";
import { nanoid } from "nanoid";
import { RecurringInterval, TransactionType } from "@prisma/client";
import BulkScanTransactionTable from "./_components/BulkScanTransactionTable";
import { defaultCategories } from "@/lib/constants/categories";

type ScannedReceipt = {
  amount: number;
  date: Date;
  description?: string;
  category?: string;
};

export type Recurring = "NONE" | RecurringInterval;

export type EditableTransaction = {
  id: string; // client-side id (uuid)
  selected: boolean; // checkbox
  date: string; // YYYY-MM-DD
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  recurring: Recurring;
};

export default function Page() {
  const [transactions, setTransactions] = useState<EditableTransaction[]>([]);

  // Handler when bulk scan is complete
  const handleBulkScanComplete = (data: ScannedReceipt[]) => {
    const mapped = data.map((receipt) => ({
      id: nanoid(),
      selected: false,
      date: receipt.date.toISOString().split("T")[0], // format to YYYY-MM-DD
      type: TransactionType.EXPENSE,
      amount: receipt.amount,
      description: receipt.description || "",
      // Map scanned category name to internal category id when possible.
      category: (() => {
        if (!receipt.category) return "";
        const found = defaultCategories.find(
          (c) => c.name.toLowerCase() === receipt.category?.toLowerCase(),
        );
        return found ? found.id : "";
      })(),
      recurring: "NONE" as Recurring,
    }));
    setTransactions(mapped);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* bulk receipt scanner */}
      <AiBulkReceiptScanner
        onScanComplete={(data) => {
          handleBulkScanComplete(data);
        }}
      />

      {/* editable transaction table preview */}
      <BulkScanTransactionTable
        data={transactions}
        onChangeAction={setTransactions}
      />
    </div>
  );
}
