import type {
  CreateProjectInstallationItemInput,
  ProjectInstallationItem,
} from "../dto";
import type {ProjectInstallationRepoPort} from "../port/projectInstallation.repo.port";

export class CreateProjectInstallationItemUseCase {
  constructor(private readonly repo: ProjectInstallationRepoPort) {}

  async execute(
    input: CreateProjectInstallationItemInput,
  ): Promise<ProjectInstallationItem> {
    const installation = await this.repo.getById(input.installationId);

    if (!installation) {
      throw new Error("Project installation not found");
    }

    const item = await this.repo.createItem(input);
    await this.repo.updateDerivedState(input.installationId);

    return item;
  }
}
