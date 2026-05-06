import type {ProcurementStatus} from "../dto";

export const PURCHASES_STATUS_LABEL: Record<ProcurementStatus, string> = {
  PENDING: "Pendiente",
  ORDERED: "Ordenado",
  RECEIVED: "Recibido",
  CANCELLED: "Cancelado",
};
