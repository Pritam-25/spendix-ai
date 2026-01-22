import getDefaultAccountDataForDashboard from "@/lib/data/dashboard/queries";
import DashboardClient from "./_components/DashboardClient";

export default async function DashboardPage() {
  const data = await getDefaultAccountDataForDashboard();

  return <DashboardClient data={data} />;
}
