"use client";

import {useState} from "react";
import {useSearchParams} from "next/navigation";
import {FileSpreadsheet} from "lucide-react";

import {apiGetFile} from "@/app/lib/api.client";
import {downloadBlob} from "@/app/lib/downloadBlob";
import type {QuotationListQuery} from "@/app/core/quotations/dto";
import {toQuotationSearchParams} from "@/app/utils/toQuotationSearchParams";

type QuotationExportExcelButtonProps = {
  className?: string;
  label?: string;
};

export default function QuotationExportExcelButton({
  className = "",
  label = "Exportar Excel",
}: QuotationExportExcelButtonProps) {
  const sp = useSearchParams();
  const [loading, setLoading] = useState(false);

  async function handleExportExcel() {
    if (loading) return;

    setLoading(true);

    try {
      const q: Partial<QuotationListQuery> = {
        search: sp.get("search")?.trim() || undefined,
        createdById: sp.get("createdById") || undefined,
        status:
          (sp.get("status") as QuotationListQuery["status"] | null) ||
          undefined,
        dateField:
          (sp.get("dateField") as QuotationListQuery["dateField"] | null) ||
          undefined,
        dateFrom: sp.get("dateFrom") ? new Date(sp.get("dateFrom")!) : undefined,
        dateTo: sp.get("dateTo") ? new Date(sp.get("dateTo")!) : undefined,
        totalMin: sp.get("totalMin") ? Number(sp.get("totalMin")) : undefined,
        totalMax: sp.get("totalMax") ? Number(sp.get("totalMax")) : undefined,
        reference: sp.get("reference") || undefined,
        cursor: undefined,
      };

      const qs = toQuotationSearchParams(q);

      const {blob, filename} = await apiGetFile(
        `/api/quotations/reports/excel?${qs.toString()}`,
      );

      downloadBlob({
        blob,
        filename:
          filename ??
          `reporte-cotizaciones-${new Date().toISOString().slice(0, 10)}.xlsx`,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExportExcel}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}>
      <FileSpreadsheet className="h-4 w-4" />
      {loading ? "Exportando..." : label}
    </button>
  );
}
