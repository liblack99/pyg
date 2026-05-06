import type {QuotationRepoPort} from "@/app/core/quotations/port/quotation.repo.port";

export class CancelQuotationUseCase {
  constructor(private readonly repo: QuotationRepoPort) {}

  async execute(input: {id: string}) {
    return this.repo.cancel(input.id);
  }
}
