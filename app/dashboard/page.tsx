import {fetchServer} from "@/app/lib/fetch.server";
import type {Me} from "@/app/lib/auth.types";
import type {DashboardOverview as DashboardOverviewData} from "@/app/core/dashboard/dto";
import {DashboardOverview} from "./components/DashboardOverview";

export default async function DashboardPage() {
  const [me, overview] = await Promise.all([
    fetchServer<Me>("/api/me"),
    fetchServer<DashboardOverviewData>("/api/dashboard/overview"),
  ]);

  return (
    <div className="space-y-6 p-6">
      <DashboardOverview
        permissions={me.permissions}
        overview={overview}
        userEmail={me.email}
        userRole={me.role}
      />
    </div>
  );
}
