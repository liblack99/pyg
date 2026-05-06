import type {ProjectRepoPort} from "../port/project.repo.port";
import type {ProjectListQuery} from "../dto";

export class ListProjectsUseCase {
  constructor(private repo: ProjectRepoPort) {}

  async execute(query: ProjectListQuery) {
    const result = await this.repo.listPaged(query);
    return result;
  }
}
