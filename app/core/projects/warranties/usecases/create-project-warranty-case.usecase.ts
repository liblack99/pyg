import type {ProjectWarrantyRepoPort} from "../port/project-warranty.repo.port";
import type {
  CreateProjectWarrantyCaseInput,
  ProjectWarrantyCaseView,
} from "../dto";

export class CreateProjectWarrantyCaseUseCase {
  constructor(private readonly repo: ProjectWarrantyRepoPort) {}

  async execute(
    projectId: string,
    input: CreateProjectWarrantyCaseInput,
  ): Promise<ProjectWarrantyCaseView> {
    const created = await this.repo.createCase(projectId, input);
    await this.repo.recalculateProjectWarrantyMetrics(projectId);
    return created;
  }
}
