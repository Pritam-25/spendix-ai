"use client";

import { useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  Repeat,
  Settings,
  Plus,
  PiggyBank,
  ChartPie,
  CircleFadingArrowUp,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import UserDropdown from "@/components/web/user-dropdown";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: CreditCard,
  },
  {
    title: "Accounts",
    url: "/accounts",
    icon: Wallet,
  },
  {
    title: "Budget",
    url: "/budget",
    icon: ChartPie,
  },
  {
    title: "Recurring",
    url: "/transactions/recurrings",
    icon: Repeat,
  },
  {
    title: "Ai Imports",
    url: "/transactions/ai-imports",
    icon: CircleFadingArrowUp,
  },
];

export function AppSidebar() {
  const { openUserProfile } = useClerk();
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        {/* App brand */}
        <div className="px-3 py-4 bg-secondary/30 border-b border-border">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight"
          >
            <span className="inline-block rounded-md bg-primary/10 px-2 py-1 text-primary">
              <PiggyBank className="h-5 w-5 text-primary" />
            </span>
            <span className="text-black dark:text-white">Spendix</span>
          </Link>
        </div>

        {/* Primary action */}
        <div className="px-3 py-3">
          <Button asChild className="w-full justify-start gap-2" size="sm">
            <Link href="/transactions/create">
              <Plus className="h-4 w-4" />
              <span>Add transaction</span>
            </Link>
          </Button>
        </div>

        {/* Main App Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname === item.url ||
                      pathname?.startsWith(`${item.url}/`)
                    }
                  >
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Preferences</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => openUserProfile()}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <UserDropdown variant="sidebar" />
      </SidebarFooter>
    </Sidebar>
  );
}
