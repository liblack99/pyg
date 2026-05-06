import {ProjectBudgetItemRow} from "../dto";
import {ProjectBudgetItemUpdateInput} from "../dto";

export interface ProjectBudgetItemRepoPort {
  listByProjectId(projectId: string): Promise<ProjectBudgetItemRow[]>;

  update(
    projectId: string,
    itemId: string,
    input: ProjectBudgetItemUpdateInput,
  ): Promise<ProjectBudgetItemRow>;

  remove(projectId: string, itemId: string): Promise<void>;
  getById(projectId: string, itemId: string): Promise<ProjectBudgetItemRow>;
}
