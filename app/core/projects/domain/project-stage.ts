import type {ProjectView} from "../dto";
import {
  ClipboardList,
  ShoppingCart,
  Factory,
  Truck,
  CircleCheck,
} from "lucide-react";

export const PROJECT_STAGES = [
  {
    key: "PLANIFICACION",
    label: "Planificación",
    icon: ClipboardList,
  },
  {
    key: "COMPRAS",
    label: "Compras",
    icon: ShoppingCart,
  },
  {
    key: "PRODUCCION",
    label: "Producción",
    icon: Factory,
  },
  {
    key: "ENTREGA",
    label: "Entrega",
    icon: Truck,
  },
  {
    key: "CIERRE",
    label: "Cierre",
    icon: CircleCheck,
  },
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
