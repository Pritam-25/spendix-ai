import "server-only";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { ErrorCode } from "../../constants/error-codes";
import { cache } from "react";

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
