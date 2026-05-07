import {AppError} from "@/app/core/shared/errors/AppError";
import {buildProjectReportDto} from "../builders/project-report.builder";
import type {ProjectReportDto} from "../dto/project-report.dto";
import type {ProjectReportRepoPort} from "../port/project-report.repo.port";

export class GetProjectReportUseCase {
  constructor(private readonly repo: ProjectReportRepoPort) {}

  async execute(projectId: string): Promise<ProjectReportDto> {
    const record = await this.repo.findProjectReportRecord(projectId);

    if (!record) {
      throw new AppError("Project not found", 404);
    }

    return buildProjectReportDto(record);
  }
}
