import type {QuotationRepoPort} from "@/app/core/quotations/port/quotation.repo.port";

export class RejectQuotationUseCase {
  constructor(private readonly repo: QuotationRepoPort) {}

  async execute(input: {id: string; reason?: string}) {
    return this.repo.reject(input.id);
  }
}
