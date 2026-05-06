import {InstallationItemStatus, ProjectInstallationStatus} from "../dto";

export const PROJECT_INSTALLATION_STATUS_LABELS: Record<
  ProjectInstallationStatus,
  string
> = {
  NOT_STARTED: "No iniciado",
  IN_PROGRESS: "En progreso",
  PAUSED: "Pausado",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
};

export const INSTALLATION_ITEM_STATUS_LABELS: Record<
  InstallationItemStatus,
  string
> = {
  PENDING: "Pendiente",
  IN_PROGRESS: "En progreso",
  BLOCKED: "Bloqueado",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
};
