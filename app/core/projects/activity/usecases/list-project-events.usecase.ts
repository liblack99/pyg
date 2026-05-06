import type {ProjectActivityRepoPort} from "../port/project-activity.repo.port";
import type {ListProjectEventsQuery} from "../dto";

export class ListProjectEventsUseCase {
  constructor(private readonly repo: ProjectActivityRepoPort) {}

  execute(projectId: string, query?: ListProjectEventsQuery) {
    return this.repo.listEvents(projectId, query);
  }
}
