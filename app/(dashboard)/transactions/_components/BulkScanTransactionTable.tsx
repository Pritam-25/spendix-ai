"use client";

import { EditableTransaction, Recurring } from "../page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CategoryCombobox } from "@/components/web/category-combobox";
import { defaultCategories } from "@/lib/constants/categories";
import { DatePicker } from "@/components/web/datpicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionType } from "@prisma/client";

type Props = {
  data: EditableTransaction[];
  onChangeAction: React.Dispatch<React.SetStateAction<EditableTransaction[]>>;
};

export default function BulkScanTransactionTable({
  data,
  onChangeAction,
}: Props) {
  /* type-safe update */
  const updateRow = <K extends keyof EditableTransaction>(
    id: string,
    field: K,
    value: EditableTransaction[K],
  ) => {
    onChangeAction((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  /* delete one */
  const deleteRow = (id: string) => {
    onChangeAction((prev) => prev.filter((r) => r.id !== id));
  };

  /* delete selected */
  const deleteSelected = () => {
    onChangeAction((prev) => prev.filter((r) => !r.selected));
  };

  /* select all */
  const toggleAll = (checked: boolean) => {
    onChangeAction((prev) => prev.map((r) => ({ ...r, selected: checked })));
  };

  const allSelected = data.length > 0 && data.every((r) => r.selected);
  const someSelected = data.some((r) => r.selected);

  // header checkbox state
  const headerChecked = allSelected;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Review transactions before saving</CardTitle>
            <CardDescription>
              Review your transactions and make edits before saving them to your
              account.
            </CardDescription>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={deleteSelected}
            disabled={!someSelected}
          >
            Delete selected
          </Button>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-accent">
                <TableRow>
                  <TableHead>
                    <Checkbox
                      checked={headerChecked}
                      onCheckedChange={(v) => toggleAll(v === true)}
                    />
                  </TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-28">Amount</TableHead>
                  <TableHead className="w-[40%]">Description</TableHead>
                  <TableHead>Recurring</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Checkbox
                        checked={row.selected}
                        onCheckedChange={(v) =>
                          updateRow(row.id, "selected", Boolean(v))
                        }
                      />
                    </TableCell>

                    <TableCell className="w-1/5">
                      <DatePicker
                        id={`date-${row.id}`}
                        label=""
                        value={row.date ? new Date(row.date) : undefined}
                        onChangeAction={(d) =>
                          updateRow(
                            row.id,
                            "date",
                            d ? d.toISOString().split("T")[0] : "",
                          )
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <Select
                        value={row.type}
                        onValueChange={(v) =>
                          updateRow(row.id, "type", v as TransactionType)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EXPENSE">Expense</SelectItem>
                          <SelectItem value="INCOME">Income</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell className="w-28">
                      <Input
                        type="number"
                        value={row.amount}
                        className="w-24"
                        onChange={(e) => {
                          const value = e.target.value;
                          updateRow(
                            row.id,
                            "amount",
                            value === "" ? 0 : Number(value),
                          );
                        }}
                      />
                    </TableCell>

                    <TableCell className="w-[40%]">
                      <Input
                        value={row.description}
                        className="w-full"
                        onChange={(e) =>
                          updateRow(row.id, "description", e.target.value)
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <Select
                        value={row.recurring}
                        onValueChange={(v) =>
                          updateRow(row.id, "recurring", v as Recurring)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NONE">None</SelectItem>
                          <SelectItem value="DAILY">Daily</SelectItem>
                          <SelectItem value="WEEKLY">Weekly</SelectItem>
                          <SelectItem value="MONTHLY">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell>
                      <CategoryCombobox
                        value={row.category}
                        onChangeAction={(v) => updateRow(row.id, "category", v)}
                        categories={defaultCategories
                          .filter((c) => c.type === row.type)
                          .map((c) => ({ id: c.id, name: c.name }))}
                        placeholder="Select category"
                        disabled={false}
                      />
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRow(row.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
