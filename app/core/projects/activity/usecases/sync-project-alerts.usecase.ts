import type {ProjectActivityRepoPort} from "../port/project-activity.repo.port";

export class SyncProjectAlertsUseCase {
  constructor(private readonly repo: ProjectActivityRepoPort) {}

  execute(projectId: string) {
    return this.repo.syncAlerts(projectId);
  }
}
