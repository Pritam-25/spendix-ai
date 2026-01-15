"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/web/mode-toggle";

const TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  accounts: "Accounts",
  transactions: "Transactions",
  budgets: "Budgets",
  recurring: "Recurring",
  settings: "Settings",
};

export function DashboardHeader() {
  const segment = useSelectedLayoutSegment();

  const title = segment ? TITLES[segment] ?? capitalize(segment) : "Dashboard";

  return (
    <div className="mb-4 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <span className="mx-2 h-5 w-[2px] bg-border" aria-hidden="true" />
        <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
      </div>
      <ModeToggle />
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
