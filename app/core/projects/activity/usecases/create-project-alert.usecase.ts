import type {CreateProjectAlertInput} from "../dto";
import type {ProjectActivityRepoPort} from "../port/project-activity.repo.port";

export class CreateProjectAlertUseCase {
  constructor(private readonly repo: ProjectActivityRepoPort) {}

  execute(projectId: string, input: CreateProjectAlertInput) {
    return this.repo.createAlert(projectId, input);
  }
}
