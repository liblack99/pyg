import type {QuotationRepoPort} from "@/app/core/quotations/port/quotation.repo.port";

export class SendQuotationUseCase {
  constructor(private readonly repo: QuotationRepoPort) {}

  async execute(input: {id: string; sentById: string}) {
    // Validaciones de negocio (mínimas aquí, fuertes en el futuro):
    // - tiene items
    // - tiene cliente
    // - total > 0
    return this.repo.send(input.id, input.sentById);
  }
}
