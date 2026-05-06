import ExcelJS from "exceljs";
import type {ExportExcelRow} from "@/app/core/quotations/excel/dto";
import {QuotationReportsExporter} from "@/app/core/quotations/excel/port/quotation.reports.port";

const STATUS_ES: Record<string, string> = {
  DRAFT: "Borrador",
  SENT: "Enviada",
  APPROVED: "Aprobada",
  REJECTED: "Rechazada",
  EXPIRED: "Vencida",
  CANCELLED: "Cancelada",
};

export const quotationReportsExcelExporter: QuotationReportsExporter = {
  async quotationsToXlsxBuffer({title, generatedAtIso, filtersLabel, rows}) {
    const wb = new ExcelJS.Workbook();
    wb.creator = "Parque y Grama";
    wb.created = new Date(generatedAtIso);

    const ws = wb.addWorksheet("Cotizaciones", {
      views: [{state: "frozen", ySplit: 4}],
    });

    const LAST_COL = "M";

    // ---- Banner (filas 1-3) ----
    ws.mergeCells(`A1:${LAST_COL}1`);
    ws.getCell("A1").value = title;
    ws.getCell("A1").font = {bold: true, size: 16, name: "Calibri"};

    ws.mergeCells(`A2:${LAST_COL}2`);
    ws.getCell("A2").value = `Generado: ${generatedAtIso}`;
    ws.getCell("A2").font = {italic: true, name: "Calibri"};

    ws.mergeCells(`A3:${LAST_COL}3`);
    ws.getCell("A3").value = `Filtros: ${filtersLabel}`;
    ws.getCell("A3").font = {italic: true, name: "Calibri"};

    // ---- Columnas (SIN header; headers manuales en fila 4) ----
    ws.columns = [
      {key: "numberQuotation", width: 16},
      {key: "date", width: 12},
      {key: "clientName", width: 26},
      {key: "clientDocumentType", width: 26},
      {key: "clientDocumentNumber", width: 26},
      {key: "clientContact", width: 16},
      {key: "clientContactNumber", width: 14},
      {key: "clientEmail", width: 30},
      {key: "projectReference", width: 22},
      {key: "location", width: 14},
      {key: "totalGeneral", width: 22},
      {key: "status", width: 12},
      {key: "createdBy", width: 18},
      {key: "validDays", width: 14},
    ];

    // ---- Headers (fila 4) ----
    const headers = [
      "N° Cotización",
      "Fecha",
      "Cliente",
      "Tipo de documento",
      "Documento",
      "Nombres del contacto",
      "Telefono del contacto",
      "Correo del contacto",
      "Referencia proyecto",
      "Ubicacion",
      "Total",
      "Estado",
      "Creada por",
      "Vigencia (días)",
    ];

    const headerRow = ws.getRow(4);

    const softBorder = {
      top: {style: "thin", color: {argb: "FFE5E7EB"}},
      left: {style: "thin", color: {argb: "FFE5E7EB"}},
      bottom: {style: "thin", color: {argb: "FFE5E7EB"}},
      right: {style: "thin", color: {argb: "FFE5E7EB"}},
    } as const;

    headers.forEach((h, i) => {
      const cell = headerRow.getCell(i + 1);
      cell.value = h;
      cell.font = {
        bold: true,
        name: "Calibri",
        size: 12,
        color: {argb: "FFFFFFFF"},
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {argb: "FF1F4E79"},
      }; // azul
      cell.border = softBorder;
    });
    headerRow.height = 22;

    const moneyFmt = '"$" #,##0;[Red]\\-"$" #,##0';

    ws.getColumn("totalGeneral").numFmt = moneyFmt;

    // Fechas (ideal si llegan como Date)
    ws.getColumn("date").numFmt = "dd/mm/yyyy";

    // ---- Data ----
    for (const r of rows) {
      const base = r;

      ws.addRow({
        ...base,
        status: STATUS_ES[base.status],
      });
    }

    // ---- AutoFilter ----
    ws.autoFilter = {
      from: {row: 4, column: 1},
      to: {row: 4, column: headers.length},
    };

    // ---- Colores por Estado (pinta celdas de la columna status) ----
    const STATUS_FILL: Record<string, string> = {
      Borrador: "FF6B7280", // gris
      Enviada: "FF2563EB", // azul
      Aprobada: "FF16A34A", // verde
      Rechazada: "FFDC2626", // rojo
      Vencida: "FFF59E0B", // amarillo
      Cancelada: "FF7C2D12", // marrón
    };

    const statusColIdx = ws.getColumn("status").number;
    for (let rowIdx = 5; rowIdx <= ws.rowCount; rowIdx++) {
      const row = ws.getRow(rowIdx);

      // bordes suaves a toda la fila (opcional, pero se ve pro)
      for (let colIdx = 1; colIdx <= headers.length; colIdx++) {
        row.getCell(colIdx).border = softBorder;
        row.getCell(colIdx).alignment = {vertical: "middle"};
      }

      const statusCell = row.getCell(statusColIdx);
      const statusText = String(statusCell.value ?? "");
      const fillColor = STATUS_FILL[statusText];
      if (fillColor) {
        statusCell.font = {
          bold: true,
          color: {argb: "FFFFFFFF"},
          name: "Calibri",
        };
        statusCell.alignment = {horizontal: "center", vertical: "middle"};
        statusCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {argb: fillColor},
        };
      }
    }

    // ---- Hoja 2: Resumen ----
    const sum = wb.addWorksheet("Resumen");
    sum.getCell("A1").value = "Resumen";
    sum.getCell("A1").font = {bold: true, size: 14, name: "Calibri"};

    const stats = buildSummary(rows);
    let rr = 3;
    for (const [k, v] of Object.entries(stats)) {
      sum.getCell(`A${rr}`).value = k;
      sum.getCell(`B${rr}`).value = v;
      rr++;
    }
    sum.getColumn(1).width = 26;
    sum.getColumn(2).width = 18;

    const buf = await wb.xlsx.writeBuffer();
    return Buffer.from(buf);
  },
};

function buildSummary(rows: ExportExcelRow[]) {
  const byStatus: Record<string, number> = {};
  let total = 0;

  for (const r of rows) {
    byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
    total++;
  }

  // Top statuses serializados
  const statusLabel = Object.entries(byStatus)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k}: ${v}`)
    .join(" | ");

  return {
    "Total registros": total,
    "Distribución por estado": statusLabel || "-",
  };
}
