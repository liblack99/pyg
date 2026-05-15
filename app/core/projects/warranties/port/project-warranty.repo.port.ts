import type {
  ProjectWarrantySummary,
  ProjectWarrantyCaseView,
  ProjectWarrantyCaseListQuery,
  ProjectWarrantyCaseListResult,
  CreateProjectWarrantyCaseInput,
  UpdateProjectWarrantyCaseInput,
  UpdateProjectWarrantySummaryInput,
} from "../dto";

export interface ProjectWarrantyRepoPort {
  getSummary(projectId: string): Promise<ProjectWarrantySummary>;

  updateSummary(
    projectId: string,
    input: UpdateProjectWarrantySummaryInput,
  ): Promise<ProjectWarrantySummary>;

  listCases(
    query: ProjectWarrantyCaseListQuery,
  ): Promise<ProjectWarrantyCaseListResult>;

  getCaseById(caseId: string): Promise<ProjectWarrantyCaseView | null>;

  createCase(
    projectId: string,
    input: CreateProjectWarrantyCaseInput,
  ): Promise<ProjectWarrantyCaseView>;

  updateCase(
    caseId: string,
    input: UpdateProjectWarrantyCaseInput,
  ): Promise<ProjectWarrantyCaseView>;

  deleteCase(caseId: string): Promise<ProjectWarrantyCaseView>;

  recalculateProjectWarrantyMetrics(projectId: string): Promise<void>;
}
