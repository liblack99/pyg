import {QuotationPdfRepo} from "@/app/core/quotations/pdf/port/quotationPdf.port";
import {QuotationRepoPort} from "@/app/core/quotations/port/quotation.repo.port";
import {DownloadPdfQuotationUseCase} from "./download-quotation-pdf.usecase";

export function makeQuotationsPdfUseCases(
  quotationRepo: QuotationRepoPort,
  generatePdf?: QuotationPdfRepo,
) {
  return {
    downloaderPdf: new DownloadPdfQuotationUseCase(quotationRepo, generatePdf),
  };
}
