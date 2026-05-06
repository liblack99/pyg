import type {ProjectActivityRepoPort} from "../port/project-activity.repo.port";

export class ResolveProjectAlertUseCase {
  constructor(private readonly repo: ProjectActivityRepoPort) {}

  execute(alertId: string) {
    return this.repo.resolveAlert(alertId);
  }
}
