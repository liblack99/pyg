import {ProjectBudgetItemRow} from "../../budget/dto";

export type ProcurementStatus =
  | "PENDING"
  | "ORDERED"
  | "RECEIVED"
  | "CANCELLED";

export type ProjectShoppingItem = Omit<
  ProjectBudgetItemRow,
  "projectId" | "notes"
> & {
  procurementStatus: ProcurementStatus;
  orderedAt: Date | null;
  receivedAt: Date | null;
  purchaseNotes: string | null;
};
export type UpdateProcurementInput = {
  status: ProcurementStatus;
  purchaseNotes: string | null;
};

export type UpdateProcurementResponse = {
  id: string;
  procurementStatus: ProcurementStatus;
  orderedAt: Date | null;
  receivedAt: Date | null;
  purchaseNotes: string | null;
  supplierId: string | null;
  totalCost: number;
};
