import type {ProjectFinanceRepoPort} from "../port/project-finance.repo.port";
import {GetProjectFinanceUseCase} from "./get-project-finance.usecase";
import {CreateProjectFinanceEntryUseCase} from "./create-project-finance-entry.usecase";
import {UpdateProjectFinanceEntryUseCase} from "./update-project-finance-entry.usecase";
import {VoidProjectFinanceEntryUseCase} from "./void-project-finance-entry.usecase";

export {
  GetProjectFinanceUseCase,
  CreateProjectFinanceEntryUseCase,
  UpdateProjectFinanceEntryUseCase,
  VoidProjectFinanceEntryUseCase,
};

export function makeProjectFinanceUseCases(repo: ProjectFinanceRepoPort) {
  return {
    getProjectFinance: new GetProjectFinanceUseCase(repo),
    createProjectFinanceEntry: new CreateProjectFinanceEntryUseCase(repo),
    updateProjectFinanceEntry: new UpdateProjectFinanceEntryUseCase(repo),
    voidProjectFinanceEntry: new VoidProjectFinanceEntryUseCase(repo),
  };
}
