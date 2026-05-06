"use client";

import {useMemo} from "react";
import type {ProjectView} from "@/app/core/projects/dto";
import {ProjectSummaryGeneralInfo} from "./ProjectSummaryGeneralInfo";
import {ProjectSummaryHealthCards} from "./ProjectSummaryHealthCards";
import {ProjectSummaryKeyDates} from "./ProjectSummaryKeyDates";

import {ProjectSummaryAlerts} from "./ProjectSummaryAlerts";
import {
  computeProjectStage,
  getProjectStageLabel,
} from "@/app/core/projects/domain/project-stage";
import {
  buildProjectSummaryAlerts,
  getProjectBudgetMetrics,
  getProjectBudgetRiskMeta,
  getProjectProductionMeta,
  getProjectScheduleMeta,
} from "@/app/core/projects/domain/project-summary";

type Props = {
  project: ProjectView;
};

export function ProjectSummary({project}: Props) {
  const stageKey = useMemo(() => computeProjectStage(project), [project]);
  const stageLabel = useMemo(() => getProjectStageLabel(stageKey), [stageKey]);

  const budget = useMemo(() => getProjectBudgetMetrics(project), [project]);
  const budgetMeta = useMemo(
    () => getProjectBudgetRiskMeta(budget.pct),
    [budget.pct],
  );
  const scheduleMeta = useMemo(
    () => getProjectScheduleMeta(project),
    [project],
  );
  const productionMeta = useMemo(
    () => getProjectProductionMeta(project),
    [project],
  );
  const alerts = useMemo(() => buildProjectSummaryAlerts(project), [project]);

  return (
    <div className="space-y-6">
      {/* INFORMACIÓN GENERAL */}
      <ProjectSummaryGeneralInfo
        project={project}
        stageLabel={getProjectStageLabel(stageKey)}
      />
      {/* CARDS DE SALUD */}
      <ProjectSummaryHealthCards
        project={project}
        stageLabel={stageLabel}
        budget={budget}
        budgetMeta={budgetMeta}
        scheduleMeta={scheduleMeta}
        productionMeta={productionMeta}
      />

      {/* ALERTAS */}
      <ProjectSummaryAlerts alerts={alerts} />

      {/* FECHAS CLAVE */}
      <ProjectSummaryKeyDates project={project} />
    </div>
  );
}
