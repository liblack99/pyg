import {ProductionOrder} from "../dto";

export interface ProductionOrderRepoPort {
  productionOrderPdfToPdfBuffer: (data: ProductionOrder) => Promise<Uint8Array>;
}
