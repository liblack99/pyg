import type {ProjectReportRepoPort} from "../port/project-report.repo.port";
import {GetProjectReportUseCase} from "./get-project-report.usecase";

export function makeProjectReportUseCases(repo: ProjectReportRepoPort) {
  return {
    getProjectReport: new GetProjectReportUseCase(repo),
  };
}
