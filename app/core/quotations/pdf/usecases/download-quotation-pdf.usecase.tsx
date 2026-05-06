import type {QuotationRepoPort} from "@/app/core/quotations/port/quotation.repo.port";
import type {QuotationPdfRepo} from "../port/quotationPdf.port";

export class DownloadPdfQuotationUseCase {
  constructor(
    private readonly repo: QuotationRepoPort,
    private readonly exporter?: QuotationPdfRepo,
  ) {}

  async execute(id: string) {
    const quotation = await this.repo.findById(id);
    if (!quotation) throw new Error("QUOTATION_NOT_FOUND");

    const buffer = await this.exporter?.quotationToPdfBuffer(quotation);

    if (!buffer) return null;

    return {buffer, filename: `${quotation.numberQuotation}`};
  }
}
