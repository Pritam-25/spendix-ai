import "server-only";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { ErrorCode } from "../constants/error-codes";
import { cache } from "react";
import { FeatureKey, FEATURES } from "../constants/features";

/* ---------- USER ---------- */
export const requireUser = cache(async () => {
  const { userId, isAuthenticated } = await auth();
  if (!isAuthenticated || !userId) {
    throw new Error(ErrorCode.UNAUTHORIZED);
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error(ErrorCode.USER_NOT_FOUND);
  }

  return user;
});

/* ---------- FEATURES ---------- */

export const hasFeature = cache(
  async (feature: FeatureKey): Promise<boolean> => {
    const { has } = await auth();
    return has({ feature });
  },
);

export async function requireRecurringTransactions() {
  const allowed = await hasFeature(FEATURES.RECURRING_TRANSACTIONS);

  if (!allowed) {
    throw new Error(ErrorCode.PRO_FEATURE_REQUIRED);
  }
}
