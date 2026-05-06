import type {DashboardOverview as DashboardOverviewData} from "@/app/core/dashboard/dto";
import QuickActionsSection from "./QuickActionsSection";
import {DashboardKpiSection} from "./DashboardKpiSection";
import {DashboardAlertsSection} from "./DashboardAlertsSection";
import {DashboardAttentionSection} from "./DashboardAttentionSection";
import {DashboardChartsSection} from "./DashboardChartsSection";
import {DashboardRecentActivitySection} from "./DashboardRecentActivitySection";

type Props = {
  permissions: string[];
  overview: DashboardOverviewData;
  userEmail: string;
  userRole: string;
};

export function DashboardOverview({
  permissions,
  overview,
  userEmail,
  userRole,
}: Props) {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Dashboard
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Centro de control del negocio
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Sesion: {userEmail} · Rol: {userRole}
        </p>
      </div>

      <QuickActionsSection permissions={permissions} />

      <DashboardKpiSection items={overview.kpis} />

      <DashboardAlertsSection items={overview.alerts} />

      <DashboardAttentionSection rows={overview.attentionProjects} />

      <DashboardChartsSection
        quotationTrend={overview.charts.quotationTrend}
        quotationStatus={overview.charts.quotationStatus}
        projectStages={overview.charts.projectStages}
      />

      <DashboardRecentActivitySection items={overview.activity} />
    </div>
  );
}
