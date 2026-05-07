import type {ProjectReportRawRecord} from "../dto/project-report.dto";

export interface ProjectReportRepoPort {
  findProjectReportRecord(projectId: string): Promise<ProjectReportRawRecord | null>;
}
