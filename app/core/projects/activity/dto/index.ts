export const PROJECT_ACTIVITY_MODULES = [
  "SUMMARY",
  "BUDGET",
  "PURCHASES",
  "FABRICATION",
  "INSTALLATION",
  "FINANCE",
  "DOCUMENTS",
  "NOTES",
  "WARRANTY",
] as const;

export const PROJECT_EVENT_TYPES = [
  "PROJECT_CREATED",
  "BUDGET_UPDATED",
  "PURCHASE_CREATED",
  "PURCHASE_STATUS_CHANGED",
  "FABRICATION_UPDATED",
  "FABRICATION_ITEM_COMPLETED",
  "INSTALLATION_UPDATED",
  "INSTALLATION_ITEM_COMPLETED",
  "DOCUMENT_UPLOADED",
  "WARRANTY_OPENED",
  "FINANCE_ENTRY_CREATED",
  "NOTE_CREATED",
] as const;

export const PROJECT_ALERT_TYPES = [
  "BUDGET_LIMIT_WARNING",
  "DEADLINE_NEAR",
  "DEADLINE_OVERDUE",
  "PURCHASE_PENDING",
  "FABRICATION_BLOCKED",
  "INSTALLATION_BLOCKED",
  "WARRANTY_OPEN",
  "DOCUMENT_EXPIRED",
  "FINANCE_MARGIN_RISK",
] as const;

export const PROJECT_ALERT_SEVERITIES = [
  "INFO",
  "WARNING",
  "CRITICAL",
] as const;

export const PROJECT_ALERT_STATUSES = [
  "ACTIVE",
  "RESOLVED",
  "DISMISSED",
] as const;

export type ProjectModule = (typeof PROJECT_ACTIVITY_MODULES)[number];
export type ProjectEventType = (typeof PROJECT_EVENT_TYPES)[number];
export type ProjectAlertType = (typeof PROJECT_ALERT_TYPES)[number];
export type ProjectAlertSeverity = (typeof PROJECT_ALERT_SEVERITIES)[number];
export type ProjectAlertStatus = (typeof PROJECT_ALERT_STATUSES)[number];
export type ProjectActivityMetadata = Record<string, unknown> | null;

export const PROJECT_MODULE_LABELS: Record<ProjectModule, string> = {
  SUMMARY: "Resumen",
  BUDGET: "Presupuesto",
  PURCHASES: "Compras",
  FABRICATION: "Fabricacion",
  INSTALLATION: "Instalacion",
  FINANCE: "Finanzas",
  DOCUMENTS: "Documentos",
  NOTES: "Notas",
  WARRANTY: "Garantias",
};

export function getProjectModuleHref(projectId: string, module: ProjectModule) {
  const suffix =
    module === "SUMMARY"
      ? ""
      : {
          BUDGET: "budget",
          PURCHASES: "purchases",
          FABRICATION: "fabrication",
          INSTALLATION: "installation",
          FINANCE: "finance",
          DOCUMENTS: "documents",
          NOTES: "notes",
          WARRANTY: "warranty",
        }[module];

  return `/dashboard/projects/${projectId}${suffix ? `/${suffix}` : ""}`;
}

export type ProjectEventView = {
  id: string;
  projectId: string;
  type: ProjectEventType;
  module: ProjectModule;
  title: string;
  description: string | null;
  entityId: string | null;
  metadata: ProjectActivityMetadata;
  createdById: string | null;
  createdByName: string | null;
  createdAt: string;
  href: string;
};

export type ProjectAlertView = {
  id: string;
  projectId: string;
  type: ProjectAlertType;
  module: ProjectModule;
  severity: ProjectAlertSeverity;
  status: ProjectAlertStatus;
  title: string;
  description: string | null;
  entityId: string | null;
  metadata: ProjectActivityMetadata;
  createdById: string | null;
  createdByName: string | null;
  createdAt: string;
  resolvedAt: string | null;
  dismissedAt: string | null;
  href: string;
};

export type CreateProjectEventInput = {
  type: ProjectEventType;
  module: ProjectModule;
  title: string;
  description?: string | null;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
  createdById?: string | null;
};

export type CreateProjectAlertInput = {
  type: ProjectAlertType;
  module: ProjectModule;
  severity: ProjectAlertSeverity;
  title: string;
  description?: string | null;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
  createdById?: string | null;
};

export type ListProjectEventsQuery = {
  limit?: number;
};

export type ListProjectAlertsQuery = {
  limit?: number;
  status?: ProjectAlertStatus;
};
