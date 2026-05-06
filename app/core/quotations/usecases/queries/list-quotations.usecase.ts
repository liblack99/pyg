import type {QuotationRepoPort} from "../../port/quotation.repo.port";
import type {QuotationListQuery} from "../../dto";

export class ListQuotationsUseCase {
  constructor(private readonly repo: QuotationRepoPort) {}

  async execute(query: QuotationListQuery) {
    return this.repo.listPaged(query);
  }
}
