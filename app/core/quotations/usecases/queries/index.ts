// core/quotations/queries/index.ts
import {QuotationRepoPort} from "../../port/quotation.repo.port";
import {ListQuotationsUseCase} from "./list-quotations.usecase";
import {GetQuotationByIdUseCase} from "./get-quotation-by-id.usecase";
import {DashboardQuotationUseCase} from "./dashbord-quotation.usecase";
import {GetQuotationDashboardGoalUseCase} from "./get-quotation-dashboard-goal.usecase";
import {UpdateQuotationDashboardGoalUseCase} from "./update-quotation-dashboard-goal.usecase";

export function makeQuotationQueryUseCases(repo: QuotationRepoPort) {
  return {
    list: new ListQuotationsUseCase(repo),
    getById: new GetQuotationByIdUseCase(repo),
    summary: new DashboardQuotationUseCase(repo),
    getDashboardGoal: new GetQuotationDashboardGoalUseCase(repo),
    updateDashboardGoal: new UpdateQuotationDashboardGoalUseCase(repo),
  };
}
