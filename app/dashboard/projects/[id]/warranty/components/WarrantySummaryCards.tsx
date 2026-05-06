"use client";

import {
  ShieldCheck,
  AlertCircle,
  CalendarDays,
  Wallet,
  TrendingDown,
  Calculator,
} from "lucide-react";
import {Calendar, Clock, FileText, NotebookPen} from "lucide-react";
import type {ProjectWarrantySummary} from "@/app/core/projects/warranties/dto";
import {DashboardStatCard} from "@/app/dashboard/components/DashboardStatCard";
import {
  PROJECT_WARRANTY_STATUS_LABELS,
  formatCop,
  formatDate,
  getProjectWarrantyStatusBadgeClass,
} from "../ui/warranty.utils";

type Props = {
  summary: ProjectWarrantySummary;
  totalQuotationSinIVA: number;
  budgetTotal: number;
};

export function WarrantySummaryCards({
  summary,
  totalQuotationSinIVA,
  budgetTotal,
}: Props) {
  const totalSinIva = totalQuotationSinIVA;
  const costoProyecto = budgetTotal;
  const costoGarantias = summary.costTotal;

  const profitBeforeWarranty = totalSinIva - costoProyecto;
  const profitAfterWarranty = profitBeforeWarranty - costoGarantias;

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/50 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="tracking-tight text-lg font-bold text-slate-900">
                  Garantía del Proyecto
                </h3>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${getProjectWarrantyStatusBadgeClass(
                    summary.status,
                  )}`}>
                  {PROJECT_WARRANTY_STATUS_LABELS[summary.status]}
                </span>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar size={16} className="text-blue-500" />
                  <span className="font-medium">Inicio:</span>
                  <span className="text-slate-900">
                    {formatDate(summary.startsAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar size={16} className="text-rose-500" />
                  <span className="font-medium">Fin:</span>
                  <span className="text-slate-900">
                    {formatDate(summary.endsAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Clock size={16} className="text-amber-500" />
                  <span className="font-medium">Duración:</span>
                  <span className="text-slate-900">
                    {summary.months ?? "—"} meses
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {(summary.terms || summary.notes) && (
          <div className="grid gap-5 bg-white p-5 md:grid-cols-2">
            <div className="group rounded-xl border border-slate-200 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/30">
              <div className="mb-2 flex items-center gap-2">
                <FileText size={14} className="text-blue-600" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Términos y Condiciones
                </p>
              </div>
              <p className="text-sm leading-relaxed text-slate-700">
                {summary.terms || "Sin términos registrados."}
              </p>
            </div>

            <div className="group rounded-xl border border-slate-200 p-4 transition-colors hover:border-amber-200 hover:bg-amber-50/30">
              <div className="mb-2 flex items-center gap-2">
                <NotebookPen size={14} className="text-amber-600" />
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Notas Adicionales
                </p>
              </div>
              <p className="text-sm leading-relaxed text-slate-700">
                {summary.notes || "Sin notas registradas."}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
        <DashboardStatCard
          title="Estado"
          value={PROJECT_WARRANTY_STATUS_LABELS[summary.status]}
          icon={ShieldCheck}
          variant="blue"
          hint={<span>Situación actual de la garantía</span>}
        />
        <DashboardStatCard
          title="Casos registrados"
          value={summary.casesCount}
          icon={CalendarDays}
          variant="slate"
          hint={<span>Total histórico de casos</span>}
        />
        <DashboardStatCard
          title="Casos abiertos"
          value={summary.openCasesCount}
          icon={AlertCircle}
          variant={summary.openCasesCount > 0 ? "amber" : "emerald"}
          hint={
            <span>
              {summary.openCasesCount > 0
                ? "Casos pendientes o en proceso"
                : "Sin pendientes"}
            </span>
          }
        />
        <DashboardStatCard
          title="Costo acumulado"
          value={formatCop(summary.costTotal)}
          icon={Wallet}
          variant="indigo"
          hint={<span>Costo total asociado a garantías</span>}
        />
        <DashboardStatCard
          title="Ganancia después de garantías"
          value={formatCop(profitAfterWarranty)}
          icon={TrendingDown}
          variant={profitAfterWarranty < 0 ? "rose" : "emerald"}
          hint={
            <span>
              {profitAfterWarranty < 0
                ? "Garantías exceden utilidad"
                : "Utilidad neta de garantías"}
            </span>
          }
        />

        <DashboardStatCard
          title="Costo promedio"
          value={formatCop(summary.costTotal / (summary.casesCount || 1))}
          icon={Calculator} // Importar de lucide-react
          variant="indigo"
          hint={<span>Inversión media por cada reclamo</span>}
        />
      </div>
    </div>
  );
}
