export interface QuotationNumberingPort {
  nextNumberQuotation(): Promise<string>;
  previewNextNumberQuotation(): Promise<string>;
}
