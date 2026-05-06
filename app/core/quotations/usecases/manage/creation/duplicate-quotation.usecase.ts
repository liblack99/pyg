import type {QuotationRepoPort} from "../../../port/quotation.repo.port";
import type {QuotationNumberingPort} from "../../../port/quotation.numbering.port";

export class DuplicateQuotationUseCase {
  constructor(
    private readonly repo: QuotationRepoPort,
    private readonly numbering: QuotationNumberingPort,
  ) {}

  async execute(input: {sourceId: string; createdById: string}) {
    const newNumberQuotation = await this.numbering.nextNumberQuotation();

    return this.repo.duplicate({
      sourceId: input.sourceId,
      newNumberQuotation,
      createdById: input.createdById,
    });
  }
}
