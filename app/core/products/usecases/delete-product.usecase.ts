import {ProductRepoPort} from "../port/product.repo.port";

export class DeleteProductUseCase {
  constructor(private repo: ProductRepoPort) {}

  async execute(id: string) {
    return this.repo.delete(id);
  }
}
