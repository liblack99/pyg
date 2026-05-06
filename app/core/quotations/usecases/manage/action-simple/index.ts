// core/quotations/manage/factories/simple-actions.factory.ts
import {QuotationRepoPort} from "../../../port/quotation.repo.port";
import {UpdateQuotationDraftUseCase} from "./update-quotation-draft.usecase";
import {SendQuotationUseCase} from "./send-quotation.usecase";
import {RejectQuotationUseCase} from "./reject-quotation.usecase";
import {DeleteQuotationDraftUseCase} from "./delete-quotation-draft.usecase";
import {ApproveQuotationUseCase} from "./approve-quotation.usecase";
import {AddNoteQuotationUseCase} from "./add-note-quotation.usecase";
import {CancelQuotationUseCase} from "./cancel-quotation.usecase";

export const makeQuotationSimpleActions = (repo: QuotationRepoPort) => ({
  update: new UpdateQuotationDraftUseCase(repo),
  delete: new DeleteQuotationDraftUseCase(repo),
  send: new SendQuotationUseCase(repo),
  approve: new ApproveQuotationUseCase(repo),
  addNote: new AddNoteQuotationUseCase(repo),
  reject: new RejectQuotationUseCase(repo),
  cancel: new CancelQuotationUseCase(repo),
});
