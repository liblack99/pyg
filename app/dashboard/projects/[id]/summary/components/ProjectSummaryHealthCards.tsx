"use client";

import type {ProjectView} from "@/app/core/projects/dto";
import type {
  ProjectBudgetMetrics,
  ProjectSummaryMeta,
} from "@/app/core/projects/domain/project-summary.types";
import {DashboardStatCard} from "@/app/dashboard/components/DashboardStatCard";
import {Layers, CalendarDays, PieChart, Factory} from "lucide-react";
import {
  summaryToneToBorderClass,
  summaryToneToTextClass,
} from "../ui/summary-ui";
import {formatDate} from "@/app/utils/formatDate";

type Props = {
  project: ProjectView;
  stageLabel: string;
  budget: ProjectBudgetMetrics;
  budgetMeta: ProjectSummaryMeta;
  scheduleMeta: ProjectSummaryMeta;
  productionMeta: ProjectSummaryMeta;
};

export function ProjectSummaryHealthCards({
  project,
  stageLabel,
  budget,
  budgetMeta,
  scheduleMeta,
  productionMeta,
}: Props) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <DashboardStatCard
        title="Etapa actual"
        value={stageLabel}
        icon={Layers}
        variant="blue"
        hint={
          <span className="italic text-slate-400">Estado operativo actual</span>
        }
      />

      <DashboardStatCard
        title="Cronograma"
        value={scheduleMeta.label}
        icon={CalendarDays}
        className={summaryToneToBorderClass(scheduleMeta.tone)}
        variant="slate"
        hint={
          <span className={summaryToneToTextClass(scheduleMeta.tone)}>
            {project.deliveryDueAt
              ? `Entrega: ${formatDate(project.deliveryDueAt)}`
              : "Sin fecha final"}
          </span>
        }
      />

      <DashboardStatCard
        title="Presupuesto"
        value={`${Math.round(budget.pct)}% usado`}
        icon={PieChart}
        className={summaryToneToBorderClass(budgetMeta.tone)}
        progress={{
          current: budget.pct,
          total: 100,
        }}
        hint={
          <span className={summaryToneToTextClass(budgetMeta.tone)}>
            {budgetMeta.label}
          </span>
        }
      />

      <DashboardStatCard
        title="Producción"
        value={productionMeta.label}
        icon={Factory}
        className={summaryToneToBorderClass(productionMeta.tone)}
        variant="indigo"
        hint={
          <span className={summaryToneToTextClass(productionMeta.tone)}>
            {project.requiresProductionOrder
              ? project.latestProductionOrderId
                ? "OP registrada"
                : "Falta generar OP"
              : "No requiere OP"}
          </span>
        }
      />
    </section>
  );
}
