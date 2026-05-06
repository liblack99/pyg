import type {QuotationRepoPort} from "@/app/core/quotations/port/quotation.repo.port";
import {UpdateQuotationInput} from "@/app/core/quotations/dto";

export class UpdateQuotationDraftUseCase {
  constructor(private readonly repo: QuotationRepoPort) {}

  async execute(input: UpdateQuotationInput) {
    return this.repo.update(input);
  }
}
