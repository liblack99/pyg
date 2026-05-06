import {ProductRepoPort} from "../port/product.repo.port";

export class DashboardProductsUseCase {
  constructor(private repo: ProductRepoPort) {}

  async execute() {
    return this.repo.getProductDashboardStats();
  }
}
