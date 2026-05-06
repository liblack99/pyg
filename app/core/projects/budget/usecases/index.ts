import type {ProjectBudgetItemRepoPort} from "@/app/core/projects/budget/port/projectBudgetItem.repo.port";
import {ListBudgetItemsUseCase} from "./list-budget-items.usecase";
import {UpdateBudgetItemUseCase} from "./update-budget-item.usecase";
import {DeleteBudgetItemUseCase} from "./delete-budget-item.usecase";
import {GetBudgetItemByIdUseCase} from "./get-budget-items-by-id.usecase";

export function makeProjectBudgetUseCases(repo: ProjectBudgetItemRepoPort) {
  return {
    listBudgetItems: new ListBudgetItemsUseCase(repo),
    updateBudgetItem: new UpdateBudgetItemUseCase(repo),
    deleteBudgetItem: new DeleteBudgetItemUseCase(repo),
    getBudgetItemById: new GetBudgetItemByIdUseCase(repo),
  };
}
