import type {ProjectBudgetItemUpdateInput} from "@/app/core/projects/budget/dto";
import type {ProjectBudgetItemRepoPort} from "@/app/core/projects/budget/port/projectBudgetItem.repo.port";

export class UpdateBudgetItemUseCase {
  constructor(private repo: ProjectBudgetItemRepoPort) {}

  async execute(
    projectId: string,
    itemId: string,
    patch: ProjectBudgetItemUpdateInput,
  ) {
    const updated = await this.repo.update(projectId, itemId, patch);

    return updated;
  }
}
