import { getAccounts } from "@/lib/data/accounts/queries";
import { defaultCategories } from "@/lib/constants/categories";
import AddTransactionForm from "../_components/addTransactionForm";
import { hasFeature } from "@/lib/data/auth";
import { FEATURES } from "@/lib/constants/features";

export default async function CreateTransactionPage() {
  const accounts = await getAccounts();
  const canUseRecurring = await hasFeature(FEATURES.RECURRING_TRANSACTIONS);

  return (
    <div className="max-w-2xl mx-auto">
      <AddTransactionForm
        accounts={accounts}
        category={defaultCategories}
        editmode={false}
        initialData={{}}
        canUseRecurring={canUseRecurring}
      />
    </div>
  );
}
