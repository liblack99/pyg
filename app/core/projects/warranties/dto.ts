// app/core/projects/warranties/dto.ts

export const PROJECT_WARRANTY_STATUSES = [
  "NOT_APPLICABLE",
  "PENDING",
  "ACTIVE",
  "EXPIRED",
  "VOID",
] as const;

export type ProjectWarrantyStatus = (typeof PROJECT_WARRANTY_STATUSES)[number];

export const WARRANTY_CASE_TYPES = [
  "MATERIAL",
  "INSTALLATION",
  "FINISH",
  "ADJUSTMENT",
  "VISIT",
  "OTHER",
] as const;

export type WarrantyCaseType = (typeof WARRANTY_CASE_TYPES)[number];

export const WARRANTY_CASE_STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "REJECTED",
  "CANCELLED",
] as const;

export type WarrantyCaseStatus = (typeof WARRANTY_CASE_STATUSES)[number];

export const WARRANTY_RESPONSIBILITIES = [
  "COMPANY",
  "SUPPLIER",
  "CLIENT",
  "MIXED",
  "UNDEFINED",
] as const;

export type WarrantyResponsibility = (typeof WARRANTY_RESPONSIBILITIES)[number];

export type ProjectWarrantySummary = {
  status: ProjectWarrantyStatus;
  startsAt: Date | null; // Cambiado a Date
  endsAt: Date | null; // Cambiado a Date
  months: number | null;
  terms: string | null;
  notes: string | null;
  costTotal: number;
  casesCount: number;
  openCasesCount: number;
};

export type ProjectWarrantyCaseView = {
  id: string;
  projectId: string;
  type: WarrantyCaseType;
  status: WarrantyCaseStatus;
  responsibility: WarrantyResponsibility;
  title: string;
  description: string | null;
  reportedAt: Date; // Cambiado a Date
  detectedAt: Date | null; // Cambiado a Date
  startedAt: Date | null; // Cambiado a Date
  resolvedAt: Date | null; // Cambiado a Date
  estimatedCost: number;
  realCost: number;
  supplierId: string | null;
  supplierName: string | null;
  reportedByUserId: string | null;
  reportedByUserName: string | null;
  resolutionNotes: string | null;
  internalNotes: string | null;
  createdAt: Date; // Cambiado a Date
  updatedAt: Date; // Cambiado a Date
};

export type ProjectWarrantyView = {
  projectId: string;
  projectCode: string;
  summary: ProjectWarrantySummary;
  cases: ProjectWarrantyCaseView[];
};

// --- INPUTS / DTOS PARA CREACIÓN Y ACTUALIZACIÓN ---

export type UpdateProjectWarrantySummaryInput = {
  status: ProjectWarrantyStatus;
  startsAt?: Date | null;
  endsAt?: Date | null;
  months?: number | null;
  terms?: string | null;
  notes?: string | null;
};

export type CreateProjectWarrantyCaseInput = {
  type: WarrantyCaseType;
  status?: WarrantyCaseStatus;
  responsibility?: WarrantyResponsibility;
  title: string;
  description?: string | null;
  reportedAt: Date; // Obligatoria como Date
  detectedAt?: Date | null;
  startedAt?: Date | null;
  resolvedAt?: Date | null;
  estimatedCost?: number;
  realCost?: number;
  supplierId?: string | null;
  reportedByUserId?: string | null;
  reportedByName?: string | null;
  resolutionNotes?: string | null;
  internalNotes?: string | null;
};

export type UpdateProjectWarrantyCaseInput = {
  type?: WarrantyCaseType;
  status?: WarrantyCaseStatus;
  responsibility?: WarrantyResponsibility;
  title?: string;
  description?: string | null;
  reportedAt?: Date;
  detectedAt?: Date | null;
  startedAt?: Date | null;
  resolvedAt?: Date | null;
  estimatedCost?: number;
  realCost?: number;
  supplierId?: string | null;
  reportedByUserId?: string | null;
  resolutionNotes?: string | null;
  internalNotes?: string | null;
};

// --- FILTROS (Queries) ---

export type ProjectWarrantyCaseListQuery = {
  projectId: string;
  search?: string;
  type?: WarrantyCaseType;
  status?: WarrantyCaseStatus;
  responsibility?: WarrantyResponsibility;
  reportedFrom?: Date; // Filtros como Date para facilitar la query en Prisma
  reportedTo?: Date;
  resolvedFrom?: Date;
  resolvedTo?: Date;
  cursor?: string;
  limit?: number;
};

export type ProjectWarrantyCaseListResult = {
  items: ProjectWarrantyCaseView[];
  nextCursor: string | null;
  totalCount?: number;
};

export type ProjectWarrantyStats = {
  casesCount: number;
  openCasesCount: number;
  resolvedCasesCount: number;
  rejectedCasesCount: number;
  costTotal: number;
  estimatedCostTotal: number;
};
