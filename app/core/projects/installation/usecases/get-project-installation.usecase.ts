import type {ProjectInstallationDetail} from "../dto";
import type {ProjectInstallationRepoPort} from "../port/projectInstallation.repo.port";

export class GetProjectInstallationUseCase {
  constructor(private readonly repo: ProjectInstallationRepoPort) {}

  async execute(projectId: string): Promise<ProjectInstallationDetail> {
    const installation = await this.repo.getByProjectId(projectId);

    if (!installation) {
      throw new Error("Project installation not found");
    }

    return installation;
  }
}
