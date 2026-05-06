import type {ProjectWarrantyRepoPort} from "../port/project-warranty.repo.port";
import type {ProjectWarrantySummary} from "../dto";

export class GetProjectWarrantySummaryUseCase {
  constructor(private readonly repo: ProjectWarrantyRepoPort) {}

  async execute(projectId: string): Promise<ProjectWarrantySummary> {
    return this.repo.getSummary(projectId);
  }
}
