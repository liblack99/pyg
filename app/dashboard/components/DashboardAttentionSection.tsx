import Link from "next/link";
import type {DashboardAttentionProject, DashboardAlertTone} from "@/app/core/dashboard/dto";
import {formatDate} from "@/app/utils/formatDate";

type Props = {
  rows: DashboardAttentionProject[];
};

const toneBadgeClass: Record<DashboardAlertTone, string> = {
  danger: "bg-rose-50 text-rose-700",
  warning: "bg-amber-50 text-amber-700",
  info: "bg-sky-50 text-sky-700",
};

const statusBadgeClass: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  PAUSED: "bg-amber-50 text-amber-700",
  CLOSED: "bg-slate-100 text-slate-700",
  CANCELLED: "bg-rose-50 text-rose-700",
};

export function DashboardAttentionSection({rows}: Props) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Proyectos que requieren atencion
          </h2>
          <p className="text-sm text-slate-500">
            Priorizados por riesgo operativo, financiero o proximidad de fechas.
          </p>
        </div>

        <Link
          href="/dashboard/projects"
          className="text-sm font-semibold text-blue-600 transition hover:text-blue-700">
          Ver todos los proyectos
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                {[
                  "Proyecto",
                  "Cliente",
                  "Etapa",
                  "Estado",
                  "Responsable",
                  "Fecha clave",
                  "Riesgo",
                  "Accion",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-sm">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-slate-500">
                    No hay proyectos criticos en este momento.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">
                          {row.code}
                        </span>
                        <span className="text-xs text-slate-400">
                          {row.actionLabel}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.clientName}</td>
                    <td className="px-4 py-3 text-slate-600">{row.stageLabel}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          statusBadgeClass[row.status] ?? statusBadgeClass.ACTIVE
                        }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {row.responsible || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">
                          {row.nextDateLabel || "Sin fecha"}
                        </span>
                        <span className="text-xs text-slate-400">
                          {row.nextDate ? formatDate(row.nextDate) : "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          toneBadgeClass[row.riskTone]
                        }`}>
                        {row.riskLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={row.href}
                        className="inline-flex rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50">
                        {row.actionLabel}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
