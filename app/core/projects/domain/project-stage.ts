import type {ProjectView} from "../dto";

export const PROJECT_STAGES = [
  {key: "PLANIFICACION", label: "Planificación"},
  {key: "COMPRAS", label: "Compras"},
  {key: "PRODUCCION", label: "Producción"},
  {key: "ENTREGA", label: "Entrega"},
  {key: "CIERRE", label: "Cierre"},
] as const;

export type ProjectStageKey = (typeof PROJECT_STAGES)[number]["key"];

export function computeProjectStage(p: ProjectView) {
  if (p.deliveryDoneAt) return "CIERRE";

  if (!p.deliveryDoneAt && p.deliveryDueAt) return "ENTREGA";

  if (!p.fabricationDoneAt && p.fabricationDueAt) return "PRODUCCION";

  if (!p.procurementDoneAt && p.procurementDueAt) return "COMPRAS";

  return "PLANIFICACION";
}

export function getProjectStageLabel(stageKey: ProjectStageKey): string {
  const stage = PROJECT_STAGES.find((s) => s.key === stageKey);
  return stage?.label ?? stageKey;
}
