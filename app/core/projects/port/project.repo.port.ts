import {
  ProjectListItem,
  ProjectListQuery,
  ProjectView,
  UpdateProjectInput,
  ProjectDashboardStats,
} from "../dto";

import {
  ProductionOrder,
  ProductionOrderInput,
  ProductionOrderListItem,
  ProductionOrderRecord,
} from "../orderPdf/dto";

export interface ProjectRepoPort {
  create(
    id: string,
    input: UpdateProjectInput,
    createdById: string,
  ): Promise<{id: string; code: string}>;
  findById(id: string): Promise<ProjectView | null>;

  listPaged(query: ProjectListQuery): Promise<{
    items: ProjectListItem[];
    nextCursor: string | null;
  }>;
  update(
    projectId: string,
    input: UpdateProjectInput,
  ): Promise<{id: string; code: string}>;
  productionOrderNeeds(
    projectId: string,
    input: ProductionOrderInput,
  ): Promise<ProductionOrderRecord>;
  listProductionOrders(projectId: string): Promise<ProductionOrderListItem[]>;
  findProductionOrderById(
    projectId: string,
    productionOrderId: string,
  ): Promise<ProductionOrderRecord | null>;
  approveProductionOrder(
    projectId: string,
    productionOrderId: string,
    approvedBy: string,
  ): Promise<ProductionOrderRecord>;
  getDashboardStats(): Promise<ProjectDashboardStats>;
}
