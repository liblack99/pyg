import type {Quotation} from "../../dto";

export interface QuotationPdfRepo {
  quotationToPdfBuffer(input: Quotation): Promise<Uint8Array>;
}
