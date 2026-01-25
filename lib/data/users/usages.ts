import prisma from "@/lib/prisma";
import { getUserPlanFromDB } from "./subscription";
import { PlanType } from "@prisma/client";
import { ErrorCode } from "@/lib/constants/error-codes";

const FREE_AI_RECEIPT_LIMIT = 3;

export async function guardAiReceiptScan(userId: string) {
  const plan = await getUserPlanFromDB(userId);

  if (plan !== PlanType.FREE) return;

  const usage = await prisma.usage.findUnique({
    where: { userId },
  });

  if (usage && usage.aiReceiptScans >= FREE_AI_RECEIPT_LIMIT) {
    throw new Error(ErrorCode.AI_RECEIPT_LIMIT_REACHED);
  }
}

export async function incrementAiReceiptUsage(userId: string) {
  const now = new Date();

  await prisma.usage.upsert({
    where: { userId },
    update: {
      aiReceiptScans: { increment: 1 },
    },
    create: {
      userId,
      aiReceiptScans: 1,
      periodStart: now,
      periodEnd: new Date(now.getFullYear(), now.getMonth() + 1, 0),
    },
  });
}
