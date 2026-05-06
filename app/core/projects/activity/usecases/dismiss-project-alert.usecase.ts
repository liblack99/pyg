import type {ProjectActivityRepoPort} from "../port/project-activity.repo.port";

export class DismissProjectAlertUseCase {
  constructor(private readonly repo: ProjectActivityRepoPort) {}

  execute(alertId: string) {
    return this.repo.dismissAlert(alertId);
  }
}
