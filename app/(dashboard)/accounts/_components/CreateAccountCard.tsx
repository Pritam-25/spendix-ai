"use client";

import { PlusIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import CreateAccountDrawer from "./CreateAccountDrawer";

export default function CreateAccountCard() {
  return (
    <CreateAccountDrawer>
      <Card
        role="button"
        aria-label="Create new account"
        className="
          group relative flex h-full cursor-pointer flex-col
          items-center justify-center gap-3
          rounded-xl border border-dashed
          bg-muted/10 p-6 text-center
          transition-colors duration-150
          hover:border-primary/50 hover:bg-muted/20
          focus:outline-none focus-visible:ring-2
          focus-visible:ring-primary
        "
      >
        {/* Icon */}
        <div
          className="
            flex h-11 w-11 items-center justify-center
            rounded-full border
            bg-background text-muted-foreground
            transition-colors
            group-hover:border-primary/40
            group-hover:text-primary
          "
        >
          <PlusIcon className="h-5 w-5" />
        </div>

        {/* Text */}
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-foreground">Create account</p>
          <p className="max-w-[220px] text-xs leading-relaxed text-muted-foreground">
            Add a new account to manage balances and transactions.
          </p>
        </div>
      </Card>
    </CreateAccountDrawer>
  );
}
