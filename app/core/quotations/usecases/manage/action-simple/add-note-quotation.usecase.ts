import type {QuotationRepoPort} from "../../../port/quotation.repo.port";

export class AddNoteQuotationUseCase {
  constructor(private readonly repo: QuotationRepoPort) {}

  async execute(id: string, note: string) {
    return this.repo.addNote(id, note);
  }
}
