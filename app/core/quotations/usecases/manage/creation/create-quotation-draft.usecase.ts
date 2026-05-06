import type {QuotationNumberingPort} from "../../../port/quotation.numbering.port";
import type {QuotationRepoPort} from "../../../port/quotation.repo.port";
import type {CreateQuotationInput} from "../../../dto";

export class CreateQuotationDraftUsecases {
  constructor(
    private readonly numbering: QuotationNumberingPort,
    private readonly repo: QuotationRepoPort,
  ) {}

  async execute(input: CreateQuotationInput) {
    const numberQuotation = await this.numbering.nextNumberQuotation();

    return this.repo.create({...input, numberQuotation: numberQuotation});
  }
}
