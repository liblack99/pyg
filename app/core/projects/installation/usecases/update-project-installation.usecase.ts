import type {
  ProjectInstallationWithItems,
  UpdateProjectInstallationInput,
} from "../dto";
import type {ProjectInstallationRepoPort} from "../port/projectInstallation.repo.port";

export class UpdateProjectInstallationUseCase {
  constructor(private readonly repo: ProjectInstallationRepoPort) {}

  async execute(
    installationId: string,
    input: UpdateProjectInstallationInput,
  ): Promise<ProjectInstallationWithItems> {
    const existing = await this.repo.getById(installationId);

    if (!existing) {
      throw new Error("Project installation not found");
    }

    return this.repo.update(installationId, input);
  }
}
