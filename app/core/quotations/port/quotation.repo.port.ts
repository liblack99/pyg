import type {
  CreateQuotationInput,
  CreateQuotationResult,
  Quotation,
  QuotationListQuery,
  QuotationListItem,
  PagedResult,
  UpdateQuotationInput,
  UpdateQuotationResult,
  QuotationStatus,
  InputDuplicateQuotation,
  OutputDuplicateQuotation,
  QuotationDashboardStats,
  QuotationDashboardGoal,
} from "../dto";

import type {ExportExcelRow} from "../excel/dto";

export interface QuotationRepoPort {
  create(input: CreateQuotationInput): Promise<CreateQuotationResult>;

  listPaged(
    params: QuotationListQuery,
  ): Promise<PagedResult<QuotationListItem>>;
  listForReport(query: QuotationListQuery): Promise<ExportExcelRow[]>;

  findById(id: string): Promise<Quotation | null>;

  update(input: UpdateQuotationInput): Promise<UpdateQuotationResult>;

  send(
    id: string,
    sentById?: string,
  ): Promise<{id: string; status: QuotationStatus}>;

  approve(id: string): Promise<{id: string; status: QuotationStatus}>;

  reject(id: string): Promise<{id: string; status: QuotationStatus}>;

  cancel(id: string): Promise<{id: string; status: QuotationStatus}>;

  deleteDraft(id: string): Promise<{id: string}>;
  duplicate(input: InputDuplicateQuotation): Promise<OutputDuplicateQuotation>;
  addNote(id: string, note: string): Promise<string>;
  getQuotationDashboard: () => Promise<QuotationDashboardStats>;
  getQuotationDashboardGoal(): Promise<QuotationDashboardGoal>;
  updateQuotationDashboardGoal(
    input: QuotationDashboardGoal,
  ): Promise<QuotationDashboardGoal>;
}
