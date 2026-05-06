import type {QuotationRepoPort} from "@/app/core/quotations/port/quotation.repo.port";

export class ApproveQuotationUseCase {
  constructor(private readonly repo: QuotationRepoPort) {}

  async execute(input: {id: string}) {
    return this.repo.approve(input.id);
  }
}
