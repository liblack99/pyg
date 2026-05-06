import type {ProjectBudgetItemRepoPort} from "@/app/core/projects/budget/port/projectBudgetItem.repo.port";

export class ListBudgetItemsUseCase {
  constructor(private repo: ProjectBudgetItemRepoPort) {}

  async execute(projectId: string) {
    const items = await this.repo.listByProjectId(projectId);
    return items;
  }
}
