"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

export type SubscriptionTier = "free" | "pro" | "premium";

export function useSubscriptionTier() {
  const { has } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>("free");

  useEffect(() => {
    if (!has) return;

    let active = true;

    Promise.all([has({ plan: "premium" }), has({ plan: "pro" })])
      .then(([premium, pro]) => {
        if (!active) return;

        if (premium) setTier("premium");
        else if (pro) setTier("pro");
        else setTier("free");
      })
      .catch(() => {
        if (active) setTier("free");
      });

    return () => {
      active = false;
    };
  }, [has]);

  return tier;
}
