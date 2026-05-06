import type {ProjectRepoPort} from "../../port/project.repo.port";

export class ListProjectProductionOrdersUseCase {
  constructor(private readonly repo: ProjectRepoPort) {}

  async execute(projectId: string) {
    return this.repo.listProductionOrders(projectId);
  }
}
