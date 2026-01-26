"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { DatePicker } from "@/components/web/datpicker";
import { CategoryCombobox } from "@/components/web/category-combobox";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  bulkTransactionRowSchema,
  BulkTransactionRowType,
  EditableTransaction,
} from "@/lib/schemas/transaction.schema";
import { defaultCategories } from "@/lib/constants/categories";
import { TransactionType, RecurringInterval } from "@prisma/client";

interface RowFormProps {
  row: EditableTransaction;
  onUpdateAction: (row: EditableTransaction) => void;
  onDeleteAction: () => void;
  defaultAccountId: string;
}

export function RowForm({
  row,
  onUpdateAction,
  onDeleteAction,
  defaultAccountId,
}: RowFormProps) {
  const form = useForm<BulkTransactionRowType>({
    resolver: zodResolver(bulkTransactionRowSchema),
    defaultValues: { ...row, accountId: defaultAccountId },
    mode: "onBlur",
  });

  const { register, setValue, formState, control } = form;
  const { errors } = formState;

  const watchedValues = useWatch({ control });

  // Sync parent whenever fields change
  useEffect(() => {
    onUpdateAction({
      ...row,
      ...watchedValues,
    });
  }, [watchedValues, onUpdateAction, row]);

  const rowHasError = Object.keys(errors).length > 0;

  return (
    <TableRow className={rowHasError ? "bg-red-50" : ""}>
      {/* Checkbox */}
      <TableCell>
        <Checkbox
          checked={row.selected || false}
          onCheckedChange={(checked) =>
            onUpdateAction({
              ...row,
              selected: checked === "indeterminate" ? undefined : checked,
            })
          }
        />
      </TableCell>

      {/* Date */}
      <TableCell>
        <DatePicker
          value={watchedValues.date ? new Date(watchedValues.date) : undefined}
          onChangeAction={(d) => setValue("date", d ?? new Date())}
        />
        {errors.date && (
          <p className="text-xs text-destructive mt-1">{errors.date.message}</p>
        )}
      </TableCell>

      {/* Type */}
      <TableCell>
        <Select
          value={watchedValues.type}
          onValueChange={(v) => setValue("type", v as TransactionType)}
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

      {/* Amount */}
      <TableCell>
        <Input type="number" {...register("amount")} />
        {errors.amount && (
          <p className="text-xs text-destructive mt-1">
            {errors.amount.message}
          </p>
        )}
      </TableCell>

      {/* Description */}
      <TableCell>
        <Input {...register("description")} />
      </TableCell>

      {/* Recurring */}
      <TableCell>
        <Select
          value={watchedValues.recurring}
          onValueChange={(v) => setValue("recurring", v as RecurringInterval)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["NONE", "DAILY", "WEEKLY", "MONTHLY"].map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>

      {/* Category */}
      <TableCell>
        <CategoryCombobox
          value={watchedValues.category}
          onChangeAction={(v) => setValue("category", v)}
          categories={defaultCategories
            .filter((c) => c.type === watchedValues.type)
            .map((c) => ({ id: c.id, name: c.name }))}
        />
      </TableCell>

      {/* Delete */}
      <TableCell>
        <Button variant="ghost" size="icon" onClick={onDeleteAction}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
