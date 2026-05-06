import type {ProjectView} from "../dto";
import type {
  ProjectBudgetMetrics,
  ProjectSummaryAlert,
  ProjectSummaryMeta,
} from "./project-summary.types";
import {computeProjectStage} from "./project-stage";

export function getProjectBudgetMetrics(
  project: ProjectView,
): ProjectBudgetMetrics {
  const limit = project.spendingLimit65;
  const remaining = project.remaining ?? 0;
  const budgetTotal = project.budgetTotal ?? 0;
  const used = Math.max(0, limit - remaining);
  const pct = limit > 0 ? (used / limit) * 100 : 0;

  return {limit, remaining, used, pct, budgetTotal};
}

export function getProjectBudgetRiskMeta(pct: number): ProjectSummaryMeta {
  if (pct >= 100) {
    return {label: "Excedido", tone: "danger"};
  }

  if (pct >= 80) {
    return {label: "Cerca del límite", tone: "warning"};
  }

  return {label: "Dentro del límite", tone: "success"};
}

export function getProjectScheduleMeta(
  project: ProjectView,
): ProjectSummaryMeta {
  const now = new Date();

  if (project.deliveryDoneAt) {
    return {label: "Completado", tone: "success"};
  }

  if (!project.deliveryDueAt) {
    return {label: "Sin fecha definida", tone: "neutral"};
  }

  const due = new Date(project.deliveryDueAt);
  const diffDays = Math.ceil(
    (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0) {
    return {label: "Atrasado", tone: "danger"};
  }

  if (diffDays <= 7) {
    return {label: "Próximo a vencer", tone: "warning"};
  }

  return {label: "En curso", tone: "success"};
}

export function getProjectProductionMeta(
  project: ProjectView,
): ProjectSummaryMeta {
  if (!project.requiresProductionOrder) {
    return {label: "No requerida", tone: "neutral"};
  }

  if (project.latestProductionOrderId) {
    return {label: "OP disponible", tone: "success"};
  }

  return {label: "OP pendiente", tone: "warning"};
}

export function buildProjectSummaryAlerts(
  project: ProjectView,
): ProjectSummaryAlert[] {
  const alerts: ProjectSummaryAlert[] = [];
  const metrics = getProjectBudgetMetrics(project);

  if (metrics.pct >= 100) {
    alerts.push({
      tone: "danger",
      text: "El presupuesto actual ha superado el límite permitido del 65%.",
    });
  } else if (metrics.pct >= 80) {
    alerts.push({
      tone: "warning",
      text: "El proyecto está cerca del límite permitido del 65% del valor sin IVA.",
    });
  }

  if (project.requiresProductionOrder && !project.latestProductionOrderId) {
    alerts.push({
      tone: "warning",
      text: "Este proyecto requiere Orden de Producción y todavía no tiene una registrada.",
    });
  }

  if (!project.deliveryDueAt && !project.deliveryDoneAt) {
    alerts.push({
      tone: "info",
      text: "El proyecto aún no tiene fecha estimada de entrega definida.",
    });
  }

  if (
    project.deliveryDueAt &&
    !project.fabricationDoneAt &&
    computeProjectStage(project) === "ENTREGA"
  ) {
    alerts.push({
      tone: "warning",
      text: "Hay fecha de entrega estimada, pero la producción todavía no figura como finalizada.",
    });
  }

  if (
    !project.procurementDueAt &&
    !project.fabricationDueAt &&
    !project.deliveryDueAt
  ) {
    alerts.push({
      tone: "info",
      text: "Todavía no se han definido fechas clave para compras, producción o entrega.",
    });
  }

  return alerts;
}
