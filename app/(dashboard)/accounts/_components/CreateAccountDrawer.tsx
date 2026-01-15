"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState, useTransition } from "react";
import { AccountFormType, accountSchema } from "@/lib/schemas/account.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAccount } from "@/actions/account";
import { toast } from "sonner";
import { AccountType } from "@prisma/client";

export default function CreateAccountDrawer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<AccountFormType>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: AccountType.CURRENT,
      balance: 0,
      isDefault: false,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const onSubmit = (values: AccountFormType) => {
    startTransition(async () => {
      const result = await createAccount(values);

      if (!result?.success) {
        toast.error(result?.error ?? "Something went wrong");
        return;
      }

      toast.success("Account created successfully");
      form.reset();
      setOpen(false);
    });
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>

      <DrawerContent className="max-w-3xl mx-auto">
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
          <DrawerDescription>
            Fill in the account details below.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 py-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Account Details</FieldLegend>
                <FieldDescription>
                  Fill in the details of your new account.
                </FieldDescription>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="account-name">
                      Name
                    </FieldLabel>
                    <Input
                      id="account-name"
                      placeholder="My main account"
                      disabled={isPending}
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="account-type">
                      Account Type
                    </FieldLabel>
                    <Select
                      value={watch("type")}
                      onValueChange={(value) =>
                        setValue("type", value as AccountType)
                      }
                      disabled={isPending}
                    >
                      <SelectTrigger id="account-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={AccountType.CURRENT}>
                          Current
                        </SelectItem>
                        <SelectItem value={AccountType.SAVING}>
                          Savings
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-sm text-destructive">
                        {errors.type.message}
                      </p>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="account-balance">
                      Initial Balance
                    </FieldLabel>
                    <Input
                      id="account-balance"
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      placeholder="0.00"
                      disabled={isPending}
                      {...register("balance", { valueAsNumber: true })}
                    />
                    {errors.balance && (
                      <p className="text-sm text-destructive">
                        {errors.balance.message}
                      </p>
                    )}
                  </Field>

                  <Field>
                    <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3">
                      <div className="space-y-1">
                        <FieldLabel htmlFor="account-default">
                          Default Account
                        </FieldLabel>
                        <FieldDescription>
                          This account will be used by default for
                          new transactions.
                        </FieldDescription>
                      </div>
                      <Switch
                        id="account-default"
                        checked={watch("isDefault")}
                        onCheckedChange={(value) =>
                          setValue("isDefault", value)
                        }
                        disabled={isPending}
                      />
                    </div>
                  </Field>
                </FieldGroup>
              </FieldSet>

              <Field orientation="horizontal">
                <DrawerClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DrawerClose>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Spinner className="mr-2" />}
                  {isPending ? "Creating account..." : "Create Account"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
