import type {DashboardRepoPort} from "../port/dashboard.repo.port";
import {GetDashboardOverviewUseCase} from "./get-dashboard-overview.usecase";

export function makeDashboardUseCases(repo: DashboardRepoPort) {
  return {
    getDashboardOverview: new GetDashboardOverviewUseCase(repo),
  };
}
