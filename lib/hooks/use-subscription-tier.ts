"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

export type SubscriptionTier = "free" | "pro" | "premium";

export function useSubscriptionTier() {
  const { has } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier | null>(null);

  useEffect(() => {
    let active = true;

    async function check() {
      try {
        if (!has) {
          if (active) setTier("free");
          return;
        }

        const isPremium = await has({ plan: "premium" });
        const isPro = !isPremium && (await has({ plan: "pro" }));

        if (!active) return;

        if (isPremium) setTier("premium");
        else if (isPro) setTier("pro");
        else setTier("free");
      } catch {
        if (active) setTier("free");
      }
    }

    void check();

    return () => {
      active = false;
    };
  }, [has]);

  return tier;
}
