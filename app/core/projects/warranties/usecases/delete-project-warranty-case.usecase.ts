import type {ProjectWarrantyRepoPort} from "../port/project-warranty.repo.port";
import type {ProjectWarrantyCaseView} from "../dto";

export class DeleteProjectWarrantyCaseUseCase {
  constructor(private readonly repo: ProjectWarrantyRepoPort) {}

  async execute(caseId: string): Promise<ProjectWarrantyCaseView> {
    const existing = await this.repo.getCaseById(caseId);

    if (!existing) {
      throw new Error("Caso de garantia no encontrado.");
    }

    const deleted = await this.repo.deleteCase(caseId);
    await this.repo.recalculateProjectWarrantyMetrics(existing.projectId);

    return deleted;
  }
}
