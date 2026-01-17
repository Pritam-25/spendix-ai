import { getAccounts } from "@/lib/dal/account";
import { defaultCategories } from "@/lib/data/categories";
import AddTransactionForm from "../_components/addTransactionForm";
import { hasFeature } from "@/lib/access/has-feature";
import { FEATURES } from "@/lib/access/features";

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
