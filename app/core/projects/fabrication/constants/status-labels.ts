import {FabricationItemStatus, ProjectFabricationStatus} from "../dto";

export const PROJECT_FABRICATION_STATUS_LABELS: Record<
  ProjectFabricationStatus,
  string
> = {
  NOT_STARTED: "No iniciado",
  IN_PROGRESS: "En progreso",
  PAUSED: "Pausado",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
};

export const FABRICATION_ITEM_STATUS_LABELS: Record<
  FabricationItemStatus,
  string
> = {
  PENDING: "Pendiente",
  IN_PROGRESS: "En progreso",
  PAUSED: "Pausado",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
};
