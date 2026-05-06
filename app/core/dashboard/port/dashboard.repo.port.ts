import type {DashboardOverview} from "../dto";

export interface DashboardRepoPort {
  getOverview(permissions: string[]): Promise<DashboardOverview>;
}
