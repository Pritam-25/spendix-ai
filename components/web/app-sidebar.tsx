"use client";

import { useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  BarChart3,
  Repeat,
  Settings,
} from "lucide-react";

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
    title: "Budgets",
    url: "/budgets",
    icon: BarChart3,
  },
  {
    title: "Recurring",
    url: "/recurring",
    icon: Repeat,
  },
];

export function AppSidebar() {
  const { openUserProfile } = useClerk();

  return (
    <Sidebar>
      <SidebarContent>
        {/* Main App Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Spendix</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
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
