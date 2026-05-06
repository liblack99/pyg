import {ProjectRepoPort} from "../port/project.repo.port";

export class DashboardProjectUseCase {
  constructor(private readonly repo: ProjectRepoPort) {}

  async execute() {
    const summary = await this.repo.getDashboardStats();

    return summary;
  }
}
