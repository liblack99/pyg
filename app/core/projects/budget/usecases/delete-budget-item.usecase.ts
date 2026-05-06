import type {ProjectBudgetItemRepoPort} from "@/app/core/projects/budget/port/projectBudgetItem.repo.port";

export class DeleteBudgetItemUseCase {
  constructor(private repo: ProjectBudgetItemRepoPort) {}

  async execute(projectId: string, itemId: string) {
    await this.repo.remove(projectId, itemId);
    return {ok: true};
  }
}
