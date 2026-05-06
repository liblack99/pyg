"use client";

import type {ProjectView} from "@/app/core/projects/dto";
import {moneyCOP} from "@/app/utils/moneyFormatted";
import {formatDate} from "@/app/utils/formatDate";

type Props = {
  project: ProjectView;
};

export function ProjectSummaryKeyDates({project}: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
        Fechas clave
      </h3>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ProjectSummaryDateCard
          title="Compras"
          dueAt={project.procurementDueAt}
          doneAt={project.procurementDoneAt}
        />
        <ProjectSummaryDateCard
          title="Producción"
          dueAt={project.fabricationDueAt}
          doneAt={project.fabricationDoneAt}
        />
        <ProjectSummaryDateCard
          title="Instalación"
          dueAt={project.installationDueAt}
          doneAt={project.installationDoneAt}
        />
        <ProjectSummaryDateCard
          title="Entrega"
          dueAt={project.deliveryDueAt}
          doneAt={project.deliveryDoneAt}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <ProjectSummaryMiniFinancialCard
          label="Cotización sin IVA"
          value={moneyCOP(project.totalQuotationSinIVA)}
        />
        <ProjectSummaryMiniFinancialCard
          label="Presupuesto actual"
          value={moneyCOP(project.budgetTotal)}
        />
        <ProjectSummaryMiniFinancialCard
          label="Saldo disponible"
          value={moneyCOP(project.remaining)}
          valueClassName={
            Number(project.remaining ?? 0) >= 0
              ? "text-emerald-600"
              : "text-rose-600"
          }
        />
      </div>
    </section>
  );
}

function ProjectSummaryDateCard({
  title,
  dueAt,
  doneAt,
}: {
  title: string;
  dueAt: string | Date | null | undefined;
  doneAt: string | Date | null | undefined;
}) {
  const completed = Boolean(doneAt);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-sm font-semibold text-slate-700">{title}</div>

      <div className="mt-4 space-y-2 text-sm">
        <div>
          <span className="block text-slate-400">Fecha plan</span>
          <span className="font-medium text-slate-900">
            {formatDate(dueAt)}
          </span>
        </div>

        <div>
          <span className="block text-slate-400">Fecha real</span>
          <span
            className={
              completed
                ? "font-medium text-emerald-600"
                : "font-medium text-slate-500"
            }>
            {formatDate(doneAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ProjectSummaryMiniFinancialCard({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <span className="block text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span
        className={`mt-2 block text-xl font-semibold text-slate-900 ${valueClassName ?? ""}`}>
        {value}
      </span>
    </div>
  );
}
