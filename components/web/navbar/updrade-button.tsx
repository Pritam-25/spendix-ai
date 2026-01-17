"use client";

import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react"; // optional small crown icon
import { useSubscriptionTier } from "@/lib/hooks/use-subscription-tier";

export default function UpgradeButton() {
  const tier = useSubscriptionTier();

  if (!tier || tier === "premium") return null;

  const targetLabel = tier === "free" ? "Upgrade to Pro" : "Upgrade to Premium";

  return (
    <Button
      size="sm"
      className="flex items-center gap-2 rounded-full px-4 py-1.5 bg-primary text-primary-foreground border border-transparent hover:bg-primary/90 hover:shadow-md dark:bg-primary-foreground dark:text-background dark:hover:bg-primary-foreground/90 transition-colors duration-150 font-medium text-[13px] tracking-wide"
    >
      <Crown className="w-4 h-4" />
      {targetLabel}
    </Button>
  );
}
