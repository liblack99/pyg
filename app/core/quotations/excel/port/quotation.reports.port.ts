import type {ExportExcelRow} from "../dto";

type ExportType = {
  title: string;
  generatedAtIso: string;
  filtersLabel: string;
  rows: ExportExcelRow[];
};

export interface QuotationReportsExporter {
  quotationsToXlsxBuffer: ({
    title,
    generatedAtIso,
    filtersLabel,
    rows,
  }: ExportType) => Promise<Buffer>;
}
