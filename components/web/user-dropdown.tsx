"use client";

import React from "react";
import Link from "next/link";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  LogOutIcon,
  LayoutDashboard,
  Wallet,
  Settings,
  ChevronsUpDown,
  CreditCard,
  Star,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSubscriptionTier } from "@/lib/hooks/use-subscription-tier";

type UserDropdownVariant = "navbar" | "sidebar";

interface UserDropdownProps {
  variant?: UserDropdownVariant;
}

export default function UserDropdown({
  variant = "navbar",
}: UserDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const tier = useSubscriptionTier();

  if (!user) return null;

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    "";
  const displayName =
    user.fullName || user.firstName || (email ? email.split("@")[0] : "User");

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const handleSignOut = () => {
    void signOut({ redirectUrl: "/" });
  };

  const handleOpenSettings = () => {
    openUserProfile();
  };

  const isSidebar = variant === "sidebar";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {isSidebar ? (
          <Button variant="outline" size="lg" className="bg-sidebar-accent">
            <div className="flex items-center gap-2 w-full">
              <Avatar className="size-7 rounded-lg">
                <AvatarImage
                  src={user.imageUrl ?? undefined}
                  alt={displayName}
                />
                <AvatarFallback className="rounded-lg text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[160px] truncate text-left space-y-0.5">
                <div className="truncate text-xs font-medium leading-snug text-secondary-foreground">
                  {displayName}
                </div>
                <div className="truncate text-[11px] text-muted-foreground leading-snug">
                  {email}
                </div>
              </div>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full p-0"
            aria-label="Open user menu"
          >
            <Avatar className="size-8">
              <AvatarImage src={user.imageUrl ?? undefined} alt={displayName} />
              <AvatarFallback className="text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        sideOffset={4}
        align="end"
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="size-9 rounded-lg">
              <AvatarImage src={user.imageUrl ?? undefined} alt={displayName} />
              <AvatarFallback className="rounded-lg text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{displayName}</span>
              <span className="text-muted-foreground truncate text-xs">
                {email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/accounts" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span>Accounts</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/transactions" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Transactions</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={handleOpenSettings}
            className="cursor-pointer"
          >
            <Settings className="h-4 w-4" />
            <span>Account settings</span>
          </DropdownMenuItem>
          {tier !== "premium" && tier && (
            <DropdownMenuItem asChild>
              <Link href="/pricing" className="flex items-center gap-2 ">
                <Star className="h-4 w-4 " />

                {tier === "free" && <span>Upgrade to Pro</span>}
                {tier === "pro" && <span>Upgrade to Premium</span>}
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer ">
          <LogOutIcon className="h-4 w-4 " />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
