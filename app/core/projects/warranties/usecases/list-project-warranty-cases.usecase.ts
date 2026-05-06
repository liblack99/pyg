import type {ProjectWarrantyRepoPort} from "../port/project-warranty.repo.port";
import type {
  ProjectWarrantyCaseListQuery,
  ProjectWarrantyCaseListResult,
} from "../dto";

export class ListProjectWarrantyCasesUseCase {
  constructor(private readonly repo: ProjectWarrantyRepoPort) {}

  async execute(
    query: ProjectWarrantyCaseListQuery,
  ): Promise<ProjectWarrantyCaseListResult> {
    return this.repo.listCases(query);
  }
}
