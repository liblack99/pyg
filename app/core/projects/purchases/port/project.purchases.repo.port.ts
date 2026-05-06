import type {
  ProjectShoppingItem,
  UpdateProcurementInput,
  UpdateProcurementResponse,
} from "../dto";

export interface ProjectPurchasesRepoPort {
  listPurchasableBudgetItems(id: string): Promise<ProjectShoppingItem[]>;
  updateBudgetItemProcurementStatus(
    id: string,
    budgetId: string,
    input: UpdateProcurementInput,
  ): Promise<UpdateProcurementResponse>;
}
