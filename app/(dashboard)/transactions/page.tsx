import { getAccounts } from "@/lib/data/accounts/queries";
import { Account, TransactionType, RecurringInterval } from "@prisma/client";
import TransactionsClient from "./_components/TransactionsClient";

export default async function Page() {
  const accounts: Account[] = await getAccounts();

  return <TransactionsClient accounts={accounts} />;
}
