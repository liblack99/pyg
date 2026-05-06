import type {ProjectDocumentType, ProjectDocumentStatus} from "../../documents/dto";

export const PROJECT_FINANCE_ENTRY_TYPES = [
  "COLLECTION",
  "PAYMENT",
  "EXTRA_INCOME",
  "EXTRA_EXPENSE",
  "ADJUSTMENT_POSITIVE",
  "ADJUSTMENT_NEGATIVE",
] as const;

export type ProjectFinanceEntryType =
  (typeof PROJECT_FINANCE_ENTRY_TYPES)[number];

export const PROJECT_FINANCE_ENTRY_CATEGORIES = [
  "ADVANCE",
  "CLIENT_PAYMENT",
  "SUPPLIER_PAYMENT",
  "MATERIAL",
  "TRANSPORT",
  "LABOR",
  "WARRANTY",
  "INSTALLATION",
  "FABRICATION",
  "ADMINISTRATIVE",
  "REFUND",
  "OTHER",
] as const;

export type ProjectFinanceEntryCategory =
  (typeof PROJECT_FINANCE_ENTRY_CATEGORIES)[number];

export const PROJECT_FINANCE_ENTRY_STATUSES = ["ACTIVE", "VOID"] as const;

export type ProjectFinanceEntryStatus =
  (typeof PROJECT_FINANCE_ENTRY_STATUSES)[number];

export type ProjectFinanceDocumentRef = {
  id: string;
  title: string;
  type: ProjectDocumentType;
  status: ProjectDocumentStatus;
  storageUrl: string | null;
};

export type ProjectFinanceEntry = {
  id: string;
  projectId: string;
  type: ProjectFinanceEntryType;
  category: ProjectFinanceEntryCategory;
  status: ProjectFinanceEntryStatus;
  amount: number;
  date: string;
  description: string;
  notes: string | null;
  documentId: string | null;
  createdById: string | null;
  createdByName: string | null;
  createdAt: string;
  updatedAt: string;
  document: ProjectFinanceDocumentRef | null;
};

export type ProjectFinanceAlertTone = "danger" | "warning" | "info" | "success";

export type ProjectFinanceAlert = {
  id: string;
  tone: ProjectFinanceAlertTone;
  title: string;
  message: string;
};

export type ProjectFinanceSummary = {
  projectId: string;
  projectCode: string;
  quotationNumber: string | null;
  saleValueWithoutTax: number;
  saleValueWithTax: number;
  spendingLimit65: number;
  budgetCurrent: number;
  budgetRemaining: number;
  committedPurchasesCost: number;
  executedPurchasesCost: number;
  warrantyCostTotal: number;
  extraCostsTotal: number;
  extraIncomeTotal: number;
  collectedAmount: number;
  pendingToCollect: number;
  paidAmount: number;
  pendingToPay: number;
  estimatedCostTotal: number;
  actualCostTotal: number;
  expectedProfit: number;
  currentProfit: number;
  expectedMarginPercent: number;
  currentMarginPercent: number;
  cashFlowBalance: number;
  openWarrantyCasesCount: number;
  alerts: ProjectFinanceAlert[];
};

export type ProjectFinanceView = {
  summary: ProjectFinanceSummary;
  entries: ProjectFinanceEntry[];
};

export type CreateProjectFinanceEntryInput = {
  type: ProjectFinanceEntryType;
  category: ProjectFinanceEntryCategory;
  amount: number;
  date: string;
  description: string;
  notes?: string | null;
  documentId?: string | null;
  createdById?: string | null;
};

export type UpdateProjectFinanceEntryInput = {
  type?: ProjectFinanceEntryType;
  category?: ProjectFinanceEntryCategory;
  amount?: number;
  date?: string;
  description?: string;
  notes?: string | null;
  documentId?: string | null;
  status?: ProjectFinanceEntryStatus;
};
