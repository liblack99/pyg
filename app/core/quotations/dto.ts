import {Prisma} from "@/app/generated/prisma/client";
import {Client} from "../clients/dto";

export type QuotationStatus =
  | "DRAFT"
  | "SENT"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELLED";

export interface Quotation {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  numberQuotation: string;
  status: QuotationStatus;

  sentAt?: Date | null;
  approvedAt?: Date | null;
  rejectedAt?: Date | null;
  expiredAt?: Date | null;
  cancelledAt?: Date | null;

  date: Date;
  validDays: number;

  createdById: string;
  createdBy?: string | null;

  clientId?: string | null;
  client?: string;

  clientSnapshot: Prisma.InputJsonValue;

  projectReference: string;
  projectReferenceDetail?: string;
  projectPresentation: string;

  specialConditions?: string | null;
  timeDelivery?: string | null;
  workLocation?: string | null;
  guarantees?: string | null;
  commercialCondition?: string | null;
  paymentMethod?: string | null;
  installationSystem: string | null;

  reviewTemplateId?: string | null;
  reviewTemplate?: string | null;
  reviewTitle?: string | null;
  reviewDetails?: string | null;

  totalGeneral: number;

  items?: QuotationItem[];
  terms?: QuotationTerm[];

  projectId?: string | null;
  contractId?: string | null;
  note: string | null;
}

export interface QuotationItem {
  id: string;
  createdAt: Date;
  quotationId: string;
  productId?: string | null;
  productName?: string | null;
  code: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  adminPercent: number;
  utilPercent: number;
  imprPercent: number;
  ivaPercent: number;
}

export interface QuotationTerm {
  id: string;
  quotationId: string;
  key?: string | null;
  text: string;
  required: boolean;
  accepted: boolean;
  order: number;
}

export type UpdateQuotationDefaultValues = {
  id: string;
  numberQuotation: string;
  status: QuotationStatus;
  date: Date; // Cambiado a Date
  validDays: number;
  clientSnapshot: ClientDefaultValues;
  projectReference: string;
  projectReferenceDetail?: string;
  projectPresentation: string;
  specialConditions?: string | null;
  timeDelivery?: string | null;
  workLocation?: string | null;
  guarantees?: string | null;
  commercialCondition?: string | null;
  paymentMethod?: string | null;
  reviewTemplateId?: string | null;
  reviewTemplate?: string | null;
  reviewTitle?: string | null;
  reviewDetails?: string | null;
  totalGeneral: number;
  items?: ItemDefaultValue[];
  terms?: TermDefaultValue[];
  projectId?: string | null;
  contractId?: string | null;
};

export type ItemDefaultValue = {
  code: string;
  productName: string;
  productId: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  adminPercent: number;
  imprPercent: number;
  utilPercent: number;
  ivaPercent: number;
  description?: string | null | undefined;
};

export type TermDefaultValue = {
  key: string;
  text: string;
  required: boolean;
  accepted: boolean;
};

export type ClientDefaultValues = {
  id: string;
  name: string;
  documentType: string;
  documentNumber: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  department?: string | null;
};

export type CreateQuotationInput = Omit<
  Quotation,
  "id" | "createdAt" | "updatedAt"
>;

export type CreateQuotationItemInput = Omit<QuotationItem, "id" | "createdAt">;

export type UpdateQuotationItemInput = Partial<QuotationItem> &
  Pick<QuotationItem, "id">;

export type CreateQuotationTermInput = Omit<
  QuotationTerm,
  "id" | "quotationId"
>;

export type UpdateQuotationTermInput = Partial<QuotationTerm> &
  Pick<QuotationItem, "id">;

export type CreateQuotationResult = {
  id: string;
  numberQuotation: string;
  status: QuotationStatus;
};

export interface UpdateQuotationInput {
  id: string;
  numberQuotation: string;
  date: Date; // Cambiado a Date
  validDays: number;

  clientId: string | null;
  clientSnapshot: unknown | null;

  projectReference: string;
  projectReferenceDetail?: string;
  projectPresentation: string;

  specialConditions: string | null;
  timeDelivery: string | null;
  workLocation: string | null;

  guarantees: string | null;
  commercialCondition: string | null;
  paymentMethod: string | null;

  reviewTitle: string | null;
  reviewDetails: string | null;

  totalGeneral: number;

  items: CreateQuotationItemInput[];
  terms: CreateQuotationTermInput[];
}

export interface UpdateQuotationResult {
  id: string;
  numberQuotation: string;
  status: QuotationStatus;
}

export type QuotationDateField =
  | "createdAt"
  | "date"
  | "sentAt"
  | "approvedAt"
  | "rejectedAt"
  | "cancelledAt"
  | "expiredAt";

export interface QuotationListQuery {
  clientId?: string;
  createdById?: string;
  status?: QuotationStatus;
  dateField?: QuotationDateField;
  dateFrom?: Date; // Cambiado a Date
  dateTo?: Date; // Cambiado a Date
  totalMin?: number;
  totalMax?: number;
  isExpired?: boolean;
  hasClient?: boolean;
  numberQuotation?: string;
  search?: string;
  sortBy?: "createdAt" | "date" | "numberQuotation" | "totalGeneral" | "status";
  sortDir?: "asc" | "desc";
  cursor?: string;
  limit?: number;
  reference?: string;
}

export type ClientSnapshot = Client | null | Prisma.JsonValue;

export interface QuotationListItem {
  id: string;
  numberQuotation: string;
  status: QuotationStatus;
  date: Date;
  validDays: number;
  createdAt: Date;
  createdById: string;
  clientId: string | null;
  clientSnapshot: ClientSnapshot;
  totalGeneral: number; // Cambiado a number para tu refactor de toNum
  note: string;
  projectReference: string;
  projectReferenceDetail?: string;
  isProject: boolean;
  projectStatus: "ACTIVE" | "PAUSED" | "CLOSED" | "CANCELLED" | null;
}

export interface ListQuotationResult {
  items: QuotationListItem[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ... Resto de tipos se mantienen igual ya que no contienen fechas ...
export type InputDuplicateQuotation = {
  sourceId: string;
  newNumberQuotation: string;
  createdById: string;
  resetTermAccepted?: boolean;
};

export type OutputDuplicateQuotation = {
  id: string;
  numberQuotation: string;
  status: QuotationStatus; // DRAFT
};

export interface PagedResult<T> {
  items: T[];
  nextCursor: string | undefined;
}

export interface QuotationDashboardStats {
  activeQuotations: {
    total: number;
    subtext: string; // e.g., "+5 este mes"
  };
  approvalRate: {
    percentage: string; // e.g., "68%"
    subtext: string; // e.g., "+12% vs anterior"
    isPositive: boolean;
  };
  valueInProcess: {
    total: number;
    formatted: string; // e.g., "$1.2B" or "$1.2M"
  };
  averageResponse: {
    value: string; // e.g., "4.2"
    label: string; // "días"
  };
  statusDetails: {
    DRAFT: number;
    SENT: number;
    APPROVED: number;
    REJECTED: number;
    CANCELLED: number;
    EXPIRED: number;
  };
  yearlySales: {amount: number; formatted: string};
  monthlySales: {amount: number; formatted: string};
  goalCompliance: {
    percentage: number;
    current: number;
    target: number;
  };
  advisorsRank: {
    id: string;
    name: string;
    count: number;
  }[];
}

export interface QuotationDashboardGoal {
  monthlySalesGoal: number;
}
