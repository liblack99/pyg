import type {QuotationRepoPort} from "@/app/core/quotations/port/quotation.repo.port";

export class GetQuotationDashboardGoalUseCase {
  constructor(private readonly repo: QuotationRepoPort) {}

  async execute() {
    return this.repo.getQuotationDashboardGoal();
  }
}
