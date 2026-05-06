import {ProductRepoPort} from "../port/product.repo.port";

import {ListProductInput, ListProductsOutput} from "../dto";

export class ListProductsUseCase {
  constructor(private repo: ProductRepoPort) {}

  async execute(input: ListProductInput): Promise<ListProductsOutput> {
    return this.repo.listPaged(input);
  }
}
