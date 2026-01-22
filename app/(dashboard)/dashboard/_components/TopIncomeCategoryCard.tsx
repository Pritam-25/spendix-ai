import { getTopCategoriesForDashboard } from "@/lib/data/dashboard/queries";
import TopIncomeBarChart from "./TopIncomeBarChart";

export default async function TopIncomeCategoryCard() {
  const { topIncomeCategories } = await getTopCategoriesForDashboard();
  return <TopIncomeBarChart categories={topIncomeCategories} />;
}
