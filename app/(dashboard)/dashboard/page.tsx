import getDefaultAccountDataForDashboard from "@/lib/data/dashboard/queries";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const data = await getDefaultAccountDataForDashboard();

  return (
    <div className="bg-black/60 p-6 min-h-screen">
      <DashboardClient data={data} />
    </div>
  );
}
