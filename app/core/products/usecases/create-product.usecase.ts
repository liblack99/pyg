import {ProductRepoPort} from "../port/product.repo.port";
import {CreateProductInput} from "../dto";

export class CreateProductUseCase {
  constructor(private repo: ProductRepoPort) {}

  async execute(input: CreateProductInput) {
    return this.repo.create(input);
  }
}
