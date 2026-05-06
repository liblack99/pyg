import type {ProjectRepoPort} from "../port/project.repo.port";
import type {UpdateProjectInput} from "../dto";

export class UpdateProjectsUseCase {
  constructor(private repo: ProjectRepoPort) {}

  async execute(projectId: string, input: UpdateProjectInput) {
    const result = await this.repo.update(projectId, input);
    return result;
  }
}
