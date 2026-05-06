import {GenerateOrderProductionUseCase} from "./generate-order-production.usecase";
import {ProjectRepoPort} from "../../port/project.repo.port";
import {ProductionOrderRepoPort} from "../port/project.productionOrder.repo.port";
import {ListProjectProductionOrdersUseCase} from "./list-project-production-orders.usecase";
import {GetProjectProductionOrderByIdUseCase} from "./get-project-production-order-by-id.usecase";
import {ApproveProjectProductionOrderUseCase} from "./approve-project-production-order.usecase";
import {DownloadProjectProductionOrderPdfUseCase} from "./download-project-production-order-pdf.usecase";

export function makeOrderProductionUseCases(
  projectRepo: ProjectRepoPort,
  opRepo: ProductionOrderRepoPort,
) {
  return {
    create: new GenerateOrderProductionUseCase(projectRepo),
    list: new ListProjectProductionOrdersUseCase(projectRepo),
    getById: new GetProjectProductionOrderByIdUseCase(projectRepo),
    approve: new ApproveProjectProductionOrderUseCase(projectRepo),
    downloadPdf: new DownloadProjectProductionOrderPdfUseCase(
      projectRepo,
      opRepo,
    ),
  };
}
