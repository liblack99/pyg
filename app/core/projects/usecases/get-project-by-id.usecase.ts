import type {ProjectRepoPort} from "../port/project.repo.port";

export class GetProjectByIdUseCase {
  constructor(private repo: ProjectRepoPort) {}

  async execute(id: string) {
    const project = await this.repo.findById(id);

    return project;
  }
}
