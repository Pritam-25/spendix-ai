"use client";

import { buttonVariants } from "@/components/ui/button";
import { Crown } from "lucide-react"; // optional small crown icon
import { useSubscriptionTier } from "@/lib/hooks/use-subscription-tier";
// Render a non-anchor so parent Link can wrap this component without nesting <a>
import { cn } from "@/lib/cn";

export default function UpgradeButton() {
  const tier = useSubscriptionTier();

  if (!tier || tier === "premium") return null;

  const targetLabel = tier === "free" ? "Upgrade to Pro" : "Upgrade to Premium";

  return (
    <span
      className={cn(
        buttonVariants({ variant: "default", size: "sm" }),
        "inline-flex items-center gap-2",
      )}
    >
      <Crown className="w-4 h-4" />
      {targetLabel}
    </span>
  );
}
