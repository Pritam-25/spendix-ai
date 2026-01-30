import { FEATURE_MIN_PLAN } from "@/lib/config/feature-requirements";
import { FeatureKey } from "@/lib/config/features";
import { isPlanSufficient } from "@/lib/config/plan-order";
import { ErrorCode } from "@/lib/constants/error-codes";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { PlanType, SubscriptionStatus } from "@prisma/client";

export async function getUserPlanFromDB(clerkUserId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    include: {
      subscription: {
        include: { items: true },
      },
    },
  });

  if (!user?.subscription) return null;

  const item = user.subscription.items[0];

  if (!item) return null;

  if (
    item.status !== SubscriptionStatus.ACTIVE &&
    item.status !== SubscriptionStatus.TRIALING
  ) {
    return null;
  }

  return item.planType;
}

// require feature for server-side actions
export async function requireFeature(feature: FeatureKey) {
  const { has, userId } = await auth();

  if (!userId) {
    throw new Error(ErrorCode.UNAUTHORIZED);
  }

  // 1️⃣ FAST CLERK CHECK
  const clerkAllowed = has({ feature });
  if (clerkAllowed) return true;

  // 2️⃣ DB CHECK (to know WHY)
  const userPlan = await getUserPlanFromDB(userId);
  const requiredPlan = FEATURE_MIN_PLAN[feature];

  // 3️⃣ User has no plan? throw correct error
  if (!userPlan) {
    if (requiredPlan === PlanType.PREMIUM) {
      throw new Error(ErrorCode.PREMIUM_FEATURE_REQUIRED);
    } else {
      throw new Error(ErrorCode.PRO_FEATURE_REQUIRED);
    }
  }

  // 4️⃣ PLAN COMPARISON
  if (!isPlanSufficient(userPlan, requiredPlan)) {
    // Map required plan to correct error
    switch (requiredPlan) {
      case PlanType.PREMIUM:
        throw new Error(ErrorCode.PREMIUM_FEATURE_REQUIRED);
      case PlanType.PRO:
      default:
        throw new Error(ErrorCode.PRO_FEATURE_REQUIRED);
    }
  }

  return true;
}

/*
request
  ↓
Clerk has({ feature }) ?
  ├─ YES → allow instantly (edge fast)
  └─ NO
       ↓
   DB lookup → planType
       ↓
   required plan → correct error

*/
