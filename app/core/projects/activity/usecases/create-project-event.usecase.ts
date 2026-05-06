import type {CreateProjectEventInput} from "../dto";
import type {ProjectActivityRepoPort} from "../port/project-activity.repo.port";

export class CreateProjectEventUseCase {
  constructor(private readonly repo: ProjectActivityRepoPort) {}

  execute(projectId: string, input: CreateProjectEventInput) {
    return this.repo.createEvent(projectId, input);
  }
}
