import type {ProjectRepoPort} from "../../port/project.repo.port";

export class ApproveProjectProductionOrderUseCase {
  constructor(private readonly repo: ProjectRepoPort) {}

  async execute(
    projectId: string,
    productionOrderId: string,
    approvedBy: string,
  ) {
    return this.repo.approveProductionOrder(
      projectId,
      productionOrderId,
      approvedBy,
    );
  }
}
