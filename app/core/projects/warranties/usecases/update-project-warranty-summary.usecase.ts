import type {ProjectWarrantyRepoPort} from "../port/project-warranty.repo.port";
import type {
  ProjectWarrantySummary,
  UpdateProjectWarrantySummaryInput,
} from "../dto";

export class UpdateProjectWarrantySummaryUseCase {
  constructor(private readonly repo: ProjectWarrantyRepoPort) {}

  async execute(
    projectId: string,
    input: UpdateProjectWarrantySummaryInput,
  ): Promise<ProjectWarrantySummary> {
    return this.repo.updateSummary(projectId, input);
  }
}
