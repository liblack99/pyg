import type {QuotationDashboardGoal} from "@/app/core/quotations/dto";
import type {QuotationRepoPort} from "@/app/core/quotations/port/quotation.repo.port";

export class UpdateQuotationDashboardGoalUseCase {
  constructor(private readonly repo: QuotationRepoPort) {}

  async execute(input: QuotationDashboardGoal) {
    return this.repo.updateQuotationDashboardGoal(input);
  }
}
