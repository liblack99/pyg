import type {DashboardOverview} from "../dto";
import type {DashboardRepoPort} from "../port/dashboard.repo.port";

export class GetDashboardOverviewUseCase {
  constructor(private readonly repo: DashboardRepoPort) {}

  execute(permissions: string[]): Promise<DashboardOverview> {
    return this.repo.getOverview(permissions);
  }
}
