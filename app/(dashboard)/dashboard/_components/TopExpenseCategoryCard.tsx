import { getTopCategoriesForDashboard } from "@/lib/data/dashboard/queries";
import { TopExpensePieChart } from "./TopExpensePieChart";

export default async function TopExpenseCategoryCard() {
  const { topExpenseCategories } = await getTopCategoriesForDashboard();
  return <TopExpensePieChart categories={topExpenseCategories} />;
}
