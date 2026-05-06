import type {ProjectBudgetItemRepoPort} from "@/app/core/projects/budget/port/projectBudgetItem.repo.port";
export class GetBudgetItemByIdUseCase {
  constructor(private projectBudgetItemRepo: ProjectBudgetItemRepoPort) {}

  async execute(projectId: string, itemId: string) {
    const item = await this.projectBudgetItemRepo.getById(projectId, itemId);
    return item;
  }
}
