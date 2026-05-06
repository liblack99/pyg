import {QuotationRepoPort} from "../../../port/quotation.repo.port";
import {QuotationNumberingPort} from "../../../port/quotation.numbering.port";
import {CreateQuotationDraftUsecases} from "./create-quotation-draft.usecase";
import {DuplicateQuotationUseCase} from "./duplicate-quotation.usecase";

export const makeQuotationCreationActions = (
  repo: QuotationRepoPort,
  numbering: QuotationNumberingPort,
) => ({
  create: new CreateQuotationDraftUsecases(numbering, repo),
  duplicate: new DuplicateQuotationUseCase(repo, numbering),
});
