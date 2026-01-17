import prisma from "@/lib/prisma";
import { serialize } from "@/lib/utils/serialize";
import { requireUser } from "./auth";

export const getAccounts = async () => {
  const user = await requireUser();

  const accounts = await prisma.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return accounts.map(serialize);
};
