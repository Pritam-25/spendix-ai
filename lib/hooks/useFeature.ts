"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { FeatureKey } from "../config/features";

export function useFeature(feature: FeatureKey) {
  const { has } = useAuth();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!has) {
      setAllowed(false);
      return;
    }

    try {
      const result = has({ feature });
      setAllowed(result);
    } catch {
      setAllowed(false);
    }
  }, [has, feature]);

  return allowed;
}
