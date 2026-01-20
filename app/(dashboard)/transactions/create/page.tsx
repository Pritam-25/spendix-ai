import { getAccounts } from "@/lib/data/accounts/queries";
import { defaultCategories } from "@/lib/constants/categories";
import AddTransactionForm from "../_components/addTransactionForm";
import { hasFeature } from "@/lib/data/auth";
import { FEATURES } from "@/lib/config/features";
import { getTransactionById } from "@/lib/data/transactions/queries";
import { TransactionFormType } from "@/lib/schemas/transaction.schema";

type CreateTransactionPageProps = {
  searchParams?: Promise<{ edit?: string }>;
};

export default async function CreateTransactionPage({
  searchParams,
}: CreateTransactionPageProps) {
  const accounts = await getAccounts();
  const canUseRecurring = await hasFeature(FEATURES.RECURRING_TRANSACTIONS);

  const resolveParams = await searchParams;
  const editId = resolveParams?.edit;

  let initialData: Partial<TransactionFormType> = {};

  if (editId) {
    const transactionData = await getTransactionById(editId);

    if (transactionData) {
      initialData = {
        type: transactionData.type,
        amount: Number(transactionData.amount),
        date: transactionData.date,
        description: transactionData.description ?? "",
        accountId: transactionData.accountId,
        category: transactionData.category,
        isRecurring: transactionData.isRecurring,
        recurringInterval: transactionData.recurringInterval ?? undefined,
      };
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AddTransactionForm
        accounts={accounts}
        category={defaultCategories}
        editmode={!!editId}
        editId={editId}
        initialData={initialData}
        canUseRecurring={canUseRecurring}
      />
    </div>
  );
}
