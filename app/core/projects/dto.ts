import {Client} from "../clients/dto";
import {ProjectBudgetItemRow} from "./budget/dto";

export interface ProjectType {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  code: string;
  quotationId: string;

  clientSnapshot: Client | null;

  totalQuotationSinIVA: number;
  spendingLimit65: number;
  budgetTotal: number;
  remaining: number;

  requiresProductionOrder: boolean;
  kind: ProjectKind;
  status: ProjectStatus;

  createdById: string | null;

  procurementDueAt: Date | null;
  procurementDoneAt: Date | null;

  fabricationDueAt: Date | null;
  fabricationDoneAt: Date | null;

  installationDueAt: Date | null;
  installationDoneAt: Date | null;

  deliveryDueAt: Date | null;
  deliveryDoneAt: Date | null;
}

export type ProjectKind = "SUPPLY_ONLY" | "EXECUTION" | "MIXED";

export type ProjectStatus = "ACTIVE" | "PAUSED" | "CLOSED" | "CANCELLED";

export type ProjectAttentionFilter =
  | "budget-risk"
  | "delivery-soon"
  | "pending-purchases"
  | "warranty-open"
  | "installation-tomorrow"
  | "margin-risk";

export type ProjectListQuery = {
  limit?: number;
  cursor?: string | null;
  search?: string;
  status?: ProjectStatus;
  kind?: ProjectKind;
  attention?: ProjectAttentionFilter;
};

export interface QuotationSnapshot {
  id: string;
  numberQuotation: string;
  projectReference: string | null;
}

export type ProjectListItem = {
  id: string;
  code: string;
  status: ProjectStatus;
  kind: ProjectKind;

  // Delivery: PLAN vs REAL
  deliveryDueAt: Date | null;
  deliveryDoneAt: Date | null;

  totalQuotationSinIVA: number;
  spendingLimit65: number;
  budgetTotal: number;
  remaining: number;

  requiresProductionOrder: boolean;

  quotation: QuotationSnapshot;

  createdAt: Date;
};

export type ProjectView = {
  id: string;
  code: string;
  status: ProjectStatus;
  kind: ProjectKind;
  responsible: string | null;
  // Procurement
  procurementDueAt: Date | null;
  procurementDoneAt: Date | null;

  // Fabrication
  fabricationDueAt: Date | null;
  fabricationDoneAt: Date | null;

  // Installation
  installationDueAt: Date | null;
  installationDoneAt: Date | null;

  // Delivery
  deliveryDueAt: Date | null;
  deliveryDoneAt: Date | null;

  totalQuotationSinIVA: number;
  spendingLimit65: number;
  budgetTotal: number;
  remaining: number;

  requiresProductionOrder: boolean;
  clientSnapshot: Client | null;

  quotation: QuotationSnapshot;

  createdBy: string | null;
  latestProductionOrderId: string | null;
};

export type ProjectItemNeedProductionOrder = Omit<
  ProjectBudgetItemRow,
  | "createdAt"
  | "projectId"
  | "supplierId"
  | "supplierNameSnapshot"
  | "notes"
  | "id"
>;

export type UpdateProjectInput = {
  status?: ProjectStatus;
  kind?: ProjectKind;

  procurementDueAt?: Date | null;
  procurementDoneAt?: Date | null;

  fabricationDueAt?: Date | null;
  fabricationDoneAt?: Date | null;

  installationDueAt?: Date | null;
  installationDoneAt?: Date | null;

  deliveryDueAt?: Date | null;
  deliveryDoneAt?: Date | null;
};

export interface ProjectDashboardStats {
  activeProjectsCount: number;
  upcomingDeliveriesCount: number;
  totalActiveValue: number;
  overdueProjectsCount: number;
}
