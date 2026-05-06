import type {ProjectRepoPort} from "../../port/project.repo.port";
import type {ProductionOrderRepoPort} from "../port/project.productionOrder.repo.port";
import {isProductionOrderApproved} from "../utils/production-order-status";

export class DownloadProjectProductionOrderPdfUseCase {
  constructor(
    private readonly repo: ProjectRepoPort,
    private readonly exporter: ProductionOrderRepoPort,
  ) {}

  async execute(projectId: string, productionOrderId: string) {
    const record = await this.repo.findProductionOrderById(
      projectId,
      productionOrderId,
    );

    if (!record) {
      throw new Error("Production order not found");
    }

    if (!isProductionOrderApproved(record.payload)) {
      const error = new Error("Production order is pending review");
      (error as Error & {status?: number}).status = 409;
      throw error;
    }

    const buffer = await this.exporter.productionOrderPdfToPdfBuffer(
      record.payload,
    );

    return {
      buffer,
      filename: `${record.orderNumber}.pdf`,
    };
  }
}
