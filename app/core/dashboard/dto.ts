export type DashboardCardVariant =
  | "blue"
  | "emerald"
  | "amber"
  | "rose"
  | "indigo"
  | "slate";

export type DashboardAlertTone = "danger" | "warning" | "info";

export type DashboardKpi = {
  id: string;
  title: string;
  value: number;
  hint: string;
  variant: DashboardCardVariant;
  href: string;
};

export type DashboardAlert = {
  id: string;
  title: string;
  count: number;
  description: string;
  tone: DashboardAlertTone;
  href: string;
};

export type DashboardAttentionProject = {
  id: string;
  code: string;
  clientName: string;
  stageLabel: string;
  status: string;
  responsible: string | null;
  nextDateLabel: string | null;
  nextDate: string | null;
  riskLabel: string;
  riskTone: DashboardAlertTone;
  href: string;
  actionLabel: string;
};

export type DashboardChartPoint = {
  label: string;
  value: number;
};

export type DashboardActivityItem = {
  id: string;
  type: "QUOTATION" | "PROJECT" | "DOCUMENT" | "WARRANTY" | "INSTALLATION";
  title: string;
  description: string;
  occurredAt: string;
  href: string;
};

export type DashboardOverview = {
  kpis: DashboardKpi[];
  alerts: DashboardAlert[];
  attentionProjects: DashboardAttentionProject[];
  charts: {
    quotationTrend: DashboardChartPoint[];
    quotationStatus: DashboardChartPoint[];
    projectStages: DashboardChartPoint[];
  };
  activity: DashboardActivityItem[];
  generatedAt: string;
};
