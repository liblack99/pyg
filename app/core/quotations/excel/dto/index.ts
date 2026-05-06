import {QuotationStatus} from "../../dto";

export interface ExportExcelRow {
  numberQuotation: string;
  date: Date;
  clientName: string;
  clientDocumentType: string;
  clientDocumentNumber: string;
  clientContact: string;
  clientContactNumber: string;
  clientEmail: string;
  projectReference: string;
  location: string;
  totalGeneral: number;
  validDays: number;
  status: string;
  createdBy: string;
}
export interface ExportQuotationsExcelQuery {
  search?: string;
  clientId?: string;
  createdById?: string;
  status?: "DRAFT" | "SENT" | "APPROVED" | "REJECTED" | "EXPIRED" | "CANCELLED";

  dateField?: "date" | "createdAt" | "sentAt" | "approvedAt";
  dateFrom?: string; // ISO
  dateTo?: string; // ISO

  totalMin?: string; // decimal string
  totalMax?: string; // decimal string

  hasClient?: "true" | "false";
  numberQuotation?: string;

  orderBy?: "createdAt" | "date" | "numberQuotation" | "total";
  orderDir?: "asc" | "desc";
}

export interface QuotationReportRow {
  id: string;
  numberQuotation: string;
  status: QuotationStatus;
  date: Date;
  validDays: number;
  createdAt: Date;
  clientName: string;
  clientDocumentNumber: string;
  createdBy: string;
  totalGeneral: number;
}
