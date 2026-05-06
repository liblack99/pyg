import {ProductRepoPort} from "../port/product.repo.port";
import {UpdateProductInput} from "../dto";

export class UpdateProductUseCase {
  constructor(private repo: ProductRepoPort) {}

  async execute(id: string, input: UpdateProductInput) {
    return this.repo.update(id, input);
  }
}
