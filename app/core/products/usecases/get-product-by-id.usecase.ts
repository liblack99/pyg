import {ProductRepoPort} from "../port/product.repo.port";

export class GetProductByIdUseCase {
  constructor(private repo: ProductRepoPort) {}

  async execute(id: string) {
    return this.repo.findById(id);
  }
}
