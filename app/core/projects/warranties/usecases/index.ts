import type {ProjectWarrantyRepoPort} from "../port/project-warranty.repo.port";

import {GetProjectWarrantySummaryUseCase} from "./get-project-warranty-summary.usecase";
import {UpdateProjectWarrantySummaryUseCase} from "./update-project-warranty-summary.usecase";
import {ListProjectWarrantyCasesUseCase} from "./list-project-warranty-cases.usecase";
import {CreateProjectWarrantyCaseUseCase} from "./create-project-warranty-case.usecase";
import {UpdateProjectWarrantyCaseUseCase} from "./update-project-warranty-case.usecase";

export function makeProjectWarrantyUseCases(repo: ProjectWarrantyRepoPort) {
  return {
    getProjectWarrantySummary: new GetProjectWarrantySummaryUseCase(repo),
    updateProjectWarrantySummary: new UpdateProjectWarrantySummaryUseCase(repo),
    listProjectWarrantyCases: new ListProjectWarrantyCasesUseCase(repo),
    createProjectWarrantyCase: new CreateProjectWarrantyCaseUseCase(repo),
    updateProjectWarrantyCase: new UpdateProjectWarrantyCaseUseCase(repo),
  };
}
