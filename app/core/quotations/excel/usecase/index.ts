import {QuotationRepoPort} from "@/app/core/quotations/port/quotation.repo.port";
import {QuotationReportsExporter} from "../port/quotation.reports.port";
import {ReportQuotationUseCases} from "./report-quotation.usecases";

export function makeQuotationsExcelUseCases(
  quotationRepo: QuotationRepoPort,
  exportExcel?: QuotationReportsExporter,
) {
  return {
    exportExcel: new ReportQuotationUseCases(quotationRepo, exportExcel),
  };
}
