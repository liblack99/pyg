import type {ProjectActivityRepoPort} from "../port/project-activity.repo.port";
import type {ListProjectAlertsQuery} from "../dto";

export class ListProjectAlertsUseCase {
  constructor(private readonly repo: ProjectActivityRepoPort) {}

  execute(projectId: string, query?: ListProjectAlertsQuery) {
    return this.repo.listAlerts(projectId, query);
  }
}
