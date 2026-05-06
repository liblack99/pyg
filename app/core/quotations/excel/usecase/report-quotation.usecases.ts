import type {QuotationRepoPort} from "@/app/core/quotations/port/quotation.repo.port";
import type {QuotationListQuery} from "../../dto";
import type {QuotationReportsExporter} from "../port/quotation.reports.port";

export class ReportQuotationUseCases {
  constructor(
    private readonly repo: QuotationRepoPort,
    private readonly exporter?: QuotationReportsExporter,
  ) {}

  async execute(query: QuotationListQuery) {
    const reportRows = await this.repo.listForReport(query);
    const rows = reportRows;
    const filtersLabel = buildFiltersLabel(query);

    return this.exporter?.quotationsToXlsxBuffer({
      title: "Reporte de Cotizaciones",
      generatedAtIso: new Date().toISOString(),
      filtersLabel,
      rows,
    });
  }
}

function buildFiltersLabel(q: QuotationListQuery) {
  const parts: string[] = [];

  const STATUS_ES: Record<string, string> = {
    DRAFT: "Borrador",
    SENT: "Enviada",
    APPROVED: "Aprobada",
    REJECTED: "Rechazada",
    EXPIRED: "Vencida",
    CANCELLED: "Cancelada",
  };

  const DATE_FIELD_ES: Record<string, string> = {
    date: "Fecha de cotización",
    createdAt: "Fecha de creación",
    sentAt: "Fecha de envío",
    approvedAt: "Fecha de aprobación",
  };

  const formatMoney = (v?: string | number | null) =>
    v != null ? `$${Number(v).toLocaleString("es-CO")}` : "…";

  if (q.search) parts.push(`Búsqueda: "${q.search}"`);

  if (q.status) parts.push(`Estado: ${STATUS_ES[q.status] ?? q.status}`);

  if (q.clientId) parts.push(`Cliente (ID): ${q.clientId}`);

  if (q.createdById) parts.push(`Creado por (ID): ${q.createdById}`);

  if (q.numberQuotation) parts.push(`N° Cotización: ${q.numberQuotation}`);

  if (q.reference) parts.push(`referencia: ${q.reference}`);

  if (typeof q.hasClient === "boolean")
    parts.push(q.hasClient ? "Con cliente asignado" : "Sin cliente asignado");

  if (q.dateFrom || q.dateTo) {
    const field = DATE_FIELD_ES[q.dateField ?? "createdAt"] ?? q.dateField;
    parts.push(`${field}: ${q.dateFrom} → ${q.dateTo}`);
  }

  if (q.totalMin != null || q.totalMax != null) {
    parts.push(
      `Total: ${formatMoney(q.totalMin)} → ${formatMoney(q.totalMax)}`,
    );
  }

  if (!parts.length) return "Sin filtros (todas las cotizaciones)";

  return parts.join(" | ");
}
