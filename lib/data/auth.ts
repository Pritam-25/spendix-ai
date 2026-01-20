import "server-only";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { ErrorCode } from "../constants/error-codes";
import { cache } from "react";
import { FeatureKey, FEATURES } from "../config/features";
import { SubscriptionStatus } from "@prisma/client";
import { PLAN_FEATURES } from "../config/plan-mapping";

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
export async function hasFeatureDB(
  clerkUserId: string,
  feature: FeatureKey,
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    include: {
      subscription: {
        include: {
          items: true,
        },
      },
    },
  });

  if (!user?.subscription) return false;

  const activeItem = user.subscription.items[0];

  if (!activeItem) return false;

  if (
    activeItem.status !== SubscriptionStatus.ACTIVE &&
    activeItem.status !== SubscriptionStatus.TRIALING
  ) {
    return false;
  }

  return PLAN_FEATURES[activeItem.planType]?.includes(feature) ?? false;
}

export const hasFeature = cache(
  async (feature: FeatureKey): Promise<boolean> => {
    const { has } = await auth();
    // const { has, userId } = await auth();
    // if(!userId) return false;

    // // fast clerk check
    // const clerkAllowed = has({ feature });
    // if (!clerkAllowed) return false;

    // // double check with db
    // return hasFeatureDB(userId, feature);

    return has({ feature });
  },
);

export async function requireRecurringTransactions() {
  const allowed = await hasFeature(FEATURES.RECURRING_TRANSACTIONS);

  if (!allowed) {
    throw new Error(ErrorCode.PRO_FEATURE_REQUIRED);
  }
}
