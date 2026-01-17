import { Prisma } from "@prisma/client";
import { TransactionParsedType } from "../schemas/transaction.schema";
import { calculateNextRecurringDate } from "../utils/recurring";
import { ErrorCode } from "../errors/error-codes";

export type CreateTransactionServiceProps = {
  prisma: Prisma.TransactionClient;
  userId: string;
  account: { id: string; balance: Prisma.Decimal };
  data: TransactionParsedType;
};

export async function createTransactionService({
  prisma,
  userId,
  account,
  data,
}: CreateTransactionServiceProps) {
  const balanceChange = data.type === "INCOME" ? data.amount : -data.amount;

  // calculate new balance
  const newBalance = account.balance.add(balanceChange);

  if (newBalance.lessThan(0)) {
    throw new Error(ErrorCode.INSUFFICIENT_BALANCE);
  }

  // calculate next recurring date
  const nextRecurringDate =
    data.isRecurring && data.recurringInterval
      ? calculateNextRecurringDate(data.date, data.recurringInterval)
      : null;

  // create transaction
  const transaction = await prisma.transaction.create({
    data: {
      ...data,
      userId,
      nextRecurringDate,
    },
  });

  // update account balance
  await prisma.account.update({
    where: { id: account.id },
    data: {
      balance: newBalance,
    },
  });

  return transaction;
}
