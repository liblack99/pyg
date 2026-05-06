import type {QuotationRepoPort} from "@/app/core/quotations/port/quotation.repo.port";

export class DeleteQuotationDraftUseCase {
  constructor(private readonly repo: QuotationRepoPort) {}

  async execute(id: string) {
    return this.repo.deleteDraft(id);
  }
}
