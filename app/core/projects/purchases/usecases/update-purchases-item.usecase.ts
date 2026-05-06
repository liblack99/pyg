import type {ProjectPurchasesRepoPort} from "../port/project.purchases.repo.port";
import type {UpdateProcurementInput} from "../dto";

export class UpdatePurchasesItemUseCase {
  constructor(private repo: ProjectPurchasesRepoPort) {}

  async execute(
    projectId: string,
    budgetId: string,
    input: UpdateProcurementInput,
  ) {
    const item = await this.repo.updateBudgetItemProcurementStatus(
      projectId,
      budgetId,
      input,
    );
    return item;
  }
}
