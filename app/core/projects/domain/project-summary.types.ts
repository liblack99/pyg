export type ProjectSummaryTone = "success" | "warning" | "danger" | "neutral";

export type ProjectSummaryAlertTone = "danger" | "warning" | "info";

export type ProjectBudgetMetrics = {
  limit: number;
  remaining: number;
  used: number;
  pct: number;
  budgetTotal: number;
};

export type ProjectSummaryMeta = {
  label: string;
  tone: ProjectSummaryTone;
};

export type ProjectSummaryAlert = {
  tone: ProjectSummaryAlertTone;
  text: string;
};
