import type {ProjectWarrantyRepoPort} from "../port/project-warranty.repo.port";
import type {
  ProjectWarrantyCaseView,
  UpdateProjectWarrantyCaseInput,
} from "../dto";

export class UpdateProjectWarrantyCaseUseCase {
  constructor(private readonly repo: ProjectWarrantyRepoPort) {}

  async execute(
    caseId: string,
    input: UpdateProjectWarrantyCaseInput,
  ): Promise<ProjectWarrantyCaseView> {
    const existing = await this.repo.getCaseById(caseId);

    if (!existing) {
      throw new Error("Caso de garantía no encontrado.");
    }

    const updated = await this.repo.updateCase(caseId, input);
    await this.repo.recalculateProjectWarrantyMetrics(existing.projectId);

    return updated;
  }
}
