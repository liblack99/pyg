import type {
  ProjectAlertSeverity,
  ProjectAlertStatus,
  ProjectAlertType,
  ProjectEventType,
  ProjectModule,
} from "../../activity/dto";
import type {FabricationItemStatus, ProjectFabricationStatus} from "../../fabrication/dto";
import type {ProcurementStatus} from "../../purchases/dto";
import type {
  ProjectWarrantyStatus,
  WarrantyCaseStatus,
  WarrantyCaseType,
  WarrantyResponsibility,
} from "../../warranties/dto";
import type {ProjectKind, ProjectStatus} from "../../dto";
import type {ProjectDocumentSource, ProjectDocumentStatus, ProjectDocumentType} from "../../documents/dto";

export type ProjectReportDocumentState = "PENDING" | "UPLOADED" | "GENERATED";

export type ProjectReportStageKey =
  | "PLANIFICACION"
  | "COMPRAS"
  | "PRODUCCION"
  | "ENTREGA"
  | "CIERRE";

export type ProjectReportMoney = {
  value: number;
  formatted: string;
};

export type ProjectReportHeaderDto = {
  projectId: string;
  projectCode: string;
  quotationNumber: string;
  clientName: string;
  projectStatus: ProjectStatus;
  projectStatusLabel: string;
  projectKind: ProjectKind;
  currentStage: ProjectReportStageKey;
  currentStageLabel: string;
  responsible: string;
  generatedAt: string;
  generatedAtIso: string;
};

export type ProjectReportExecutiveSummaryDto = {
  quotationWithoutIva: ProjectReportMoney;
  spendingLimit65: ProjectReportMoney;
  currentBudget: ProjectReportMoney;
  availableBalance: ProjectReportMoney;
  executedPercent: number;
  executedPercentLabel: string;
  healthLabel: string;
  healthTone: "success" | "warning" | "danger";
};

export type ProjectReportTimelineRowDto = {
  name: string;
  plannedAt: string;
  realAt: string;
  status: string;
};

export type ProjectReportBudgetItemDto = {
  id: string;
  product: string;
  description: string;
  quantity: string;
  unit: string;
  supplier: string;
  unitCost: ProjectReportMoney;
  totalCost: ProjectReportMoney;
};

export type ProjectReportBudgetDto = {
  items: ProjectReportBudgetItemDto[];
  totalBudget: ProjectReportMoney;
  spendingLimit65: ProjectReportMoney;
  balance: ProjectReportMoney;
  usagePercent: number;
  usagePercentLabel: string;
  warning: string | null;
  warningTone: "warning" | "danger" | null;
};

export type ProjectReportPurchaseDto = {
  id: string;
  item: string;
  supplier: string;
  status: ProcurementStatus;
  statusLabel: string;
  orderedAt: string;
  receivedAt: string;
};

export type ProjectReportFabricationItemDto = {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  status: FabricationItemStatus;
  statusLabel: string;
  plannedStartAt: string;
  plannedEndAt: string;
};

export type ProjectReportFabricationDto = {
  exists: boolean;
  status: ProjectFabricationStatus | "NO_REGISTERED";
  statusLabel: string;
  progressPercent: number;
  progressLabel: string;
  plannedStartAt: string;
  plannedEndAt: string;
  actualStartAt: string;
  actualEndAt: string;
  notes: string;
  items: ProjectReportFabricationItemDto[];
};

export type ProjectReportDocumentDto = {
  id: string;
  type: ProjectDocumentType;
  typeLabel: string;
  title: string;
  state: ProjectReportDocumentState;
  stateLabel: string;
  mode: ProjectDocumentSource;
  modeLabel: string;
  url: string;
};

export type ProjectReportWarrantyCaseDto = {
  id: string;
  title: string;
  type: WarrantyCaseType;
  typeLabel: string;
  status: WarrantyCaseStatus;
  statusLabel: string;
  responsible: WarrantyResponsibility;
  responsibleLabel: string;
  estimatedCost: ProjectReportMoney;
  realCost: ProjectReportMoney;
};

export type ProjectReportWarrantyDto = {
  hasWarrantyInfo: boolean;
  status: ProjectWarrantyStatus;
  statusLabel: string;
  startsAt: string;
  endsAt: string;
  months: string;
  terms: string;
  costTotal: ProjectReportMoney;
  openCasesCount: number;
  casesCount: number;
  cases: ProjectReportWarrantyCaseDto[];
};

export type ProjectReportAlertDto = {
  id: string;
  type: ProjectAlertType;
  severity: ProjectAlertSeverity;
  status: ProjectAlertStatus;
  module: ProjectModule;
  moduleLabel: string;
  title: string;
  description: string;
  createdAt: string;
};

export type ProjectReportEventDto = {
  id: string;
  type: ProjectEventType;
  module: ProjectModule;
  moduleLabel: string;
  title: string;
  description: string;
  createdAt: string;
};

export type ProjectReportDto = {
  header: ProjectReportHeaderDto;
  executiveSummary: ProjectReportExecutiveSummaryDto;
  timeline: ProjectReportTimelineRowDto[];
  budget: ProjectReportBudgetDto;
  purchases: ProjectReportPurchaseDto[];
  fabrication: ProjectReportFabricationDto;
  documents: ProjectReportDocumentDto[];
  warranty: ProjectReportWarrantyDto;
  activity: {
    alerts: ProjectReportAlertDto[];
    events: ProjectReportEventDto[];
  };
};

export type ProjectReportDecimalLike =
  | number
  | string
  | null
  | undefined
  | {
      toNumber(): number;
      toString(): string;
    };

export type ProjectReportRawRecord = {
  id: string;
  code: string;
  status: ProjectStatus;
  kind: ProjectKind;
  responsible: string | null;
  clientSnapshot: unknown;
  totalQuotationSinIVA: ProjectReportDecimalLike;
  spendingLimit65: ProjectReportDecimalLike;
  budgetTotal: ProjectReportDecimalLike;
  remaining: ProjectReportDecimalLike;
  procurementDueAt: Date | null;
  procurementDoneAt: Date | null;
  fabricationDueAt: Date | null;
  fabricationDoneAt: Date | null;
  installationDueAt: Date | null;
  installationDoneAt: Date | null;
  deliveryDueAt: Date | null;
  deliveryDoneAt: Date | null;
  warrantyStatus: ProjectWarrantyStatus;
  warrantyStartsAt: Date | null;
  warrantyEndsAt: Date | null;
  warrantyMonths: number | null;
  warrantyTerms: string | null;
  warrantyCostTotal: ProjectReportDecimalLike;
  warrantyCasesCount: number;
  openWarrantyCasesCount: number;
  quotation: {
    id: string;
    numberQuotation: string;
    projectReference: string | null;
  };
  createdBy: {
    name: string;
  } | null;
  budgetItems: {
    id: string;
    description: string;
    quantity: number | null;
    supplierNameSnapshot: string | null;
    unitCost: ProjectReportDecimalLike;
    totalCost: ProjectReportDecimalLike;
    procurementStatus: ProcurementStatus;
    orderedAt: Date | null;
    receivedAt: Date | null;
  }[];
  fabrication: {
    status: ProjectFabricationStatus;
    plannedStartAt: Date | null;
    plannedEndAt: Date | null;
    actualStartAt: Date | null;
    actualEndAt: Date | null;
    progressPercent: number;
    notes: string | null;
    items: {
      id: string;
      name: string;
      unit: string | null;
      quantity: ProjectReportDecimalLike;
      status: FabricationItemStatus;
      plannedStartAt: Date | null;
      plannedEndAt: Date | null;
    }[];
  } | null;
  documents: {
    id: string;
    type: ProjectDocumentType;
    source: ProjectDocumentSource;
    status: ProjectDocumentStatus;
    title: string;
    storageUrl: string | null;
  }[];
  warrantyCases: {
    id: string;
    type: WarrantyCaseType;
    status: WarrantyCaseStatus;
    responsibility: WarrantyResponsibility;
    title: string;
    estimatedCost: ProjectReportDecimalLike;
    realCost: ProjectReportDecimalLike;
  }[];
  alerts: {
    id: string;
    type: ProjectAlertType;
    module: ProjectModule;
    severity: ProjectAlertSeverity;
    status: ProjectAlertStatus;
    title: string;
    description: string | null;
    createdAt: Date;
  }[];
  events: {
    id: string;
    type: ProjectEventType;
    module: ProjectModule;
    title: string;
    description: string | null;
    createdAt: Date;
  }[];
};
