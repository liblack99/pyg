import {CreateProjectUseCase} from "./create-project.usecase";
import type {ProjectRepoPort} from "../port/project.repo.port";
import {GetProjectByIdUseCase} from "./get-project-by-id.usecase";
import {ListProjectsUseCase} from "./list-projects.usecase";
import {UpdateProjectsUseCase} from "./update-project.usecase";
import {DashboardProjectUseCase} from "./dashboard-project-usecase";
import type {QuotationRepoPort} from "@/app/core/quotations/port/quotation.repo.port";
import type {QuotationPdfRepo} from "@/app/core/quotations/pdf/port/quotationPdf.port";
import type {DocumentRepoPort} from "../documents/port/document-port";
import type {DocumentStoragePort} from "../documents/port/document-storage.port";

export function makeProjectsUseCases(
  projectRepo: ProjectRepoPort,
  quotationRepo?: QuotationRepoPort,
  quotationPdfRepo?: QuotationPdfRepo,
  documentRepo?: DocumentRepoPort,
  storage?: DocumentStoragePort,
) {
  return {
    Create:
      quotationRepo && quotationPdfRepo && documentRepo && storage
        ? new CreateProjectUseCase(
            projectRepo,
            quotationRepo,
            quotationPdfRepo,
            documentRepo,
            storage,
          )
        : null,
    GetProjectByID: new GetProjectByIdUseCase(projectRepo),
    ListProjects: new ListProjectsUseCase(projectRepo),
    Update: new UpdateProjectsUseCase(projectRepo),
    Summary: new DashboardProjectUseCase(projectRepo),
  };
}
