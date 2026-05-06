import type {ProjectRepoPort} from "../../port/project.repo.port";

export class GetProjectProductionOrderByIdUseCase {
  constructor(private readonly repo: ProjectRepoPort) {}

  async execute(projectId: string, productionOrderId: string) {
    return this.repo.findProductionOrderById(projectId, productionOrderId);
  }
}
