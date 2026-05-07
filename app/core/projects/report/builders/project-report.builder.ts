import {moneyCOP} from "@/app/utils/moneyFormatted";
import {PROJECT_DOCUMENT_TYPE_LABELS} from "../../documents/constants/project-document-type-labels";
import {PROJECT_MODULE_LABELS} from "../../activity/dto";
import {
  FABRICATION_ITEM_STATUS_LABELS,
  PROJECT_FABRICATION_STATUS_LABELS,
} from "../../fabrication/constants/status-labels";
import {PURCHASES_STATUS_LABEL} from "../../purchases/constant/purchases-status-label";
import {
  computeProjectStage,
  getProjectStageLabel,
} from "../../domain/project-stage";
import type {ProjectView} from "../../dto";
import type {
  ProjectReportDecimalLike,
  ProjectReportDocumentState,
  ProjectReportDto,
  ProjectReportMoney,
  ProjectReportRawRecord,
} from "../dto/project-report.dto";

const NOT_REGISTERED = "No registrado";
const WITHOUT_INFO = "Sin informacion";

function toNumber(value: ProjectReportDecimalLike): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  const parsed = value.toNumber();
  return Number.isFinite(parsed) ? parsed : 0;
}

function toQuantity(value: ProjectReportDecimalLike): string {
  const n = toNumber(value);
  return n > 0 ? new Intl.NumberFormat("es-CO").format(n) : NOT_REGISTERED;
}

function money(value: ProjectReportDecimalLike): ProjectReportMoney {
  const numeric = toNumber(value);
  return {
    value: numeric,
    formatted: moneyCOP(numeric),
  };
}

function formatDate(value: Date | null): string {
  if (!value) return NOT_REGISTERED;
  return value.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function formatDateTime(value: Date): string {
  return value.toLocaleString("es-CO", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function percentLabel(value: number): string {
  return `${Math.round(value)}%`;
}

function hasName(value: unknown): value is {name: string} {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof value.name === "string"
  );
}

function getClientName(record: ProjectReportRawRecord): string {
  if (hasName(record.clientSnapshot) && record.clientSnapshot.name.trim()) {
    return record.clientSnapshot.name;
  }
  return record.quotation.projectReference ?? NOT_REGISTERED;
}

function projectStatusLabel(status: ProjectReportRawRecord["status"]): string {
  const labels: Record<ProjectReportRawRecord["status"], string> = {
    ACTIVE: "Activo",
    PAUSED: "Pausado",
    CLOSED: "Cerrado",
    CANCELLED: "Cancelado",
  };
  return labels[status];
}

function timelineStatus(plannedAt: Date | null, realAt: Date | null): string {
  if (realAt) return "Completado";
  if (!plannedAt) return "Sin plan";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return plannedAt < today ? "Vencido" : "Pendiente";
}

function documentState(input: {
  source: ProjectReportRawRecord["documents"][number]["source"];
  status: ProjectReportRawRecord["documents"][number]["status"];
}): ProjectReportDocumentState {
  if (input.source === "GENERATED") return "GENERATED";
  if (input.status === "AVAILABLE") return "UPLOADED";
  return "PENDING";
}

function documentStateLabel(state: ProjectReportDocumentState): string {
  const labels: Record<ProjectReportDocumentState, string> = {
    PENDING: "PENDIENTE",
    UPLOADED: "CARGADO",
    GENERATED: "GENERADO",
  };
  return labels[state];
}

function documentSourceLabel(source: ProjectReportRawRecord["documents"][number]["source"]) {
  return source === "GENERATED" ? "Generado" : "Cargado";
}

function warrantyStatusLabel(status: ProjectReportRawRecord["warrantyStatus"]) {
  const labels: Record<ProjectReportRawRecord["warrantyStatus"], string> = {
    NOT_APPLICABLE: "No aplica",
    PENDING: "Pendiente",
    ACTIVE: "Activa",
    EXPIRED: "Vencida",
    VOID: "Anulada",
  };
  return labels[status];
}

function warrantyCaseStatusLabel(
  status: ProjectReportRawRecord["warrantyCases"][number]["status"],
) {
  const labels: Record<ProjectReportRawRecord["warrantyCases"][number]["status"], string> = {
    OPEN: "Abierto",
    IN_PROGRESS: "En progreso",
    RESOLVED: "Resuelto",
    REJECTED: "Rechazado",
    CANCELLED: "Cancelado",
  };
  return labels[status];
}

function warrantyCaseTypeLabel(
  type: ProjectReportRawRecord["warrantyCases"][number]["type"],
) {
  const labels: Record<ProjectReportRawRecord["warrantyCases"][number]["type"], string> = {
    MATERIAL: "Material",
    INSTALLATION: "Instalacion",
    FINISH: "Acabado",
    ADJUSTMENT: "Ajuste",
    VISIT: "Visita",
    OTHER: "Otro",
  };
  return labels[type];
}

function responsibilityLabel(
  responsibility: ProjectReportRawRecord["warrantyCases"][number]["responsibility"],
) {
  const labels: Record<
    ProjectReportRawRecord["warrantyCases"][number]["responsibility"],
    string
  > = {
    COMPANY: "Empresa",
    SUPPLIER: "Proveedor",
    CLIENT: "Cliente",
    MIXED: "Mixta",
    UNDEFINED: "No definida",
  };
  return labels[responsibility];
}

function healthForUsage(usagePercent: number) {
  if (usagePercent >= 100) {
    return {
      label: "Presupuesto excedido",
      tone: "danger" as const,
      warning: "El presupuesto supera el limite del 65%.",
    };
  }
  if (usagePercent >= 80) {
    return {
      label: "Atencion presupuestal",
      tone: "warning" as const,
      warning: "El presupuesto supera el 80% del limite permitido.",
    };
  }
  return {
    label: "Controlado",
    tone: "success" as const,
    warning: null,
  };
}

export function buildProjectReportDto(
  record: ProjectReportRawRecord,
): ProjectReportDto {
  const generatedAt = new Date();
  const budgetTotal = toNumber(record.budgetTotal);
  const spendingLimit65 = toNumber(record.spendingLimit65);
  const remaining = toNumber(record.remaining);
  const executedPercent =
    spendingLimit65 > 0 ? (budgetTotal / spendingLimit65) * 100 : 0;
  const health = healthForUsage(executedPercent);

  const projectViewForStage: ProjectView = {
    id: record.id,
    code: record.code,
    status: record.status,
    kind: record.kind,
    responsible: record.responsible,
    procurementDueAt: record.procurementDueAt,
    procurementDoneAt: record.procurementDoneAt,
    fabricationDueAt: record.fabricationDueAt,
    fabricationDoneAt: record.fabricationDoneAt,
    installationDueAt: record.installationDueAt,
    installationDoneAt: record.installationDoneAt,
    deliveryDueAt: record.deliveryDueAt,
    deliveryDoneAt: record.deliveryDoneAt,
    totalQuotationSinIVA: toNumber(record.totalQuotationSinIVA),
    spendingLimit65,
    budgetTotal,
    remaining,
    requiresProductionOrder: false,
    clientSnapshot: null,
    quotation: record.quotation,
    createdBy: record.createdBy?.name ?? null,
    latestProductionOrderId: null,
  };
  const currentStage = computeProjectStage(projectViewForStage);

  return {
    header: {
      projectId: record.id,
      projectCode: record.code,
      quotationNumber: record.quotation.numberQuotation,
      clientName: getClientName(record),
      projectStatus: record.status,
      projectStatusLabel: projectStatusLabel(record.status),
      projectKind: record.kind,
      currentStage,
      currentStageLabel: getProjectStageLabel(currentStage),
      responsible: record.responsible ?? record.createdBy?.name ?? NOT_REGISTERED,
      generatedAt: formatDateTime(generatedAt),
      generatedAtIso: generatedAt.toISOString(),
    },
    executiveSummary: {
      quotationWithoutIva: money(record.totalQuotationSinIVA),
      spendingLimit65: money(record.spendingLimit65),
      currentBudget: money(record.budgetTotal),
      availableBalance: money(record.remaining),
      executedPercent,
      executedPercentLabel: percentLabel(executedPercent),
      healthLabel: health.label,
      healthTone: health.tone,
    },
    timeline: [
      {
        name: "Compras",
        plannedAt: formatDate(record.procurementDueAt),
        realAt: formatDate(record.procurementDoneAt),
        status: timelineStatus(record.procurementDueAt, record.procurementDoneAt),
      },
      {
        name: "Fabricacion",
        plannedAt: formatDate(record.fabricationDueAt),
        realAt: formatDate(record.fabricationDoneAt),
        status: timelineStatus(record.fabricationDueAt, record.fabricationDoneAt),
      },
      {
        name: "Instalacion",
        plannedAt: formatDate(record.installationDueAt),
        realAt: formatDate(record.installationDoneAt),
        status: timelineStatus(record.installationDueAt, record.installationDoneAt),
      },
      {
        name: "Entrega",
        plannedAt: formatDate(record.deliveryDueAt),
        realAt: formatDate(record.deliveryDoneAt),
        status: timelineStatus(record.deliveryDueAt, record.deliveryDoneAt),
      },
    ],
    budget: {
      items: record.budgetItems.map((item) => ({
        id: item.id,
        product: item.description || WITHOUT_INFO,
        description: item.description || WITHOUT_INFO,
        quantity:
          typeof item.quantity === "number"
            ? new Intl.NumberFormat("es-CO").format(item.quantity)
            : NOT_REGISTERED,
        unit: "Unidad",
        supplier: item.supplierNameSnapshot ?? NOT_REGISTERED,
        unitCost: money(item.unitCost),
        totalCost: money(item.totalCost),
      })),
      totalBudget: money(record.budgetTotal),
      spendingLimit65: money(record.spendingLimit65),
      balance: money(record.remaining),
      usagePercent: executedPercent,
      usagePercentLabel: percentLabel(executedPercent),
      warning: health.warning,
      warningTone: health.tone === "success" ? null : health.tone,
    },
    purchases: record.budgetItems.map((item) => ({
      id: item.id,
      item: item.description || WITHOUT_INFO,
      supplier: item.supplierNameSnapshot ?? NOT_REGISTERED,
      status: item.procurementStatus,
      statusLabel: PURCHASES_STATUS_LABEL[item.procurementStatus],
      orderedAt: formatDate(item.orderedAt),
      receivedAt: formatDate(item.receivedAt),
    })),
    fabrication: record.fabrication
      ? {
          exists: true,
          status: record.fabrication.status,
          statusLabel: PROJECT_FABRICATION_STATUS_LABELS[record.fabrication.status],
          progressPercent: record.fabrication.progressPercent,
          progressLabel: percentLabel(record.fabrication.progressPercent),
          plannedStartAt: formatDate(record.fabrication.plannedStartAt),
          plannedEndAt: formatDate(record.fabrication.plannedEndAt),
          actualStartAt: formatDate(record.fabrication.actualStartAt),
          actualEndAt: formatDate(record.fabrication.actualEndAt),
          notes: record.fabrication.notes ?? WITHOUT_INFO,
          items: record.fabrication.items.map((item) => ({
            id: item.id,
            name: item.name || WITHOUT_INFO,
            quantity: toQuantity(item.quantity),
            unit: item.unit ?? "Unidad",
            status: item.status,
            statusLabel: FABRICATION_ITEM_STATUS_LABELS[item.status],
            plannedStartAt: formatDate(item.plannedStartAt),
            plannedEndAt: formatDate(item.plannedEndAt),
          })),
        }
      : {
          exists: false,
          status: "NO_REGISTERED",
          statusLabel: "Sin informacion",
          progressPercent: 0,
          progressLabel: "0%",
          plannedStartAt: NOT_REGISTERED,
          plannedEndAt: NOT_REGISTERED,
          actualStartAt: NOT_REGISTERED,
          actualEndAt: NOT_REGISTERED,
          notes: WITHOUT_INFO,
          items: [],
        },
    documents: record.documents.map((doc) => {
      const state = documentState(doc);
      return {
        id: doc.id,
        type: doc.type,
        typeLabel: PROJECT_DOCUMENT_TYPE_LABELS[doc.type],
        title: doc.title || WITHOUT_INFO,
        state,
        mode: doc.source,
        modeLabel: documentSourceLabel(doc.source),
        url: doc.storageUrl ?? NOT_REGISTERED,
        stateLabel: documentStateLabel(state),
      };
    }),
    warranty: {
      hasWarrantyInfo:
        record.warrantyStatus !== "NOT_APPLICABLE" ||
        Boolean(record.warrantyStartsAt) ||
        record.warrantyCasesCount > 0,
      status: record.warrantyStatus,
      statusLabel: warrantyStatusLabel(record.warrantyStatus),
      startsAt: formatDate(record.warrantyStartsAt),
      endsAt: formatDate(record.warrantyEndsAt),
      months: record.warrantyMonths ? `${record.warrantyMonths}` : NOT_REGISTERED,
      terms: record.warrantyTerms ?? WITHOUT_INFO,
      costTotal: money(record.warrantyCostTotal),
      openCasesCount: record.openWarrantyCasesCount,
      casesCount: record.warrantyCasesCount,
      cases: record.warrantyCases.map((item) => ({
        id: item.id,
        title: item.title || WITHOUT_INFO,
        type: item.type,
        typeLabel: warrantyCaseTypeLabel(item.type),
        status: item.status,
        statusLabel: warrantyCaseStatusLabel(item.status),
        responsible: item.responsibility,
        responsibleLabel: responsibilityLabel(item.responsibility),
        estimatedCost: money(item.estimatedCost),
        realCost: money(item.realCost),
      })),
    },
    activity: {
      alerts: record.alerts.map((alert) => ({
        id: alert.id,
        type: alert.type,
        severity: alert.severity,
        status: alert.status,
        module: alert.module,
        moduleLabel: PROJECT_MODULE_LABELS[alert.module],
        title: alert.title || WITHOUT_INFO,
        description: alert.description ?? WITHOUT_INFO,
        createdAt: formatDateTime(alert.createdAt),
      })),
      events: record.events.map((event) => ({
        id: event.id,
        type: event.type,
        module: event.module,
        moduleLabel: PROJECT_MODULE_LABELS[event.module],
        title: event.title || WITHOUT_INFO,
        description: event.description ?? WITHOUT_INFO,
        createdAt: formatDateTime(event.createdAt),
      })),
    },
  };
}
