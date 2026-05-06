import type {
  ProjectInstallationItem,
  UpdateProjectInstallationItemInput,
} from "../dto";
import type {ProjectInstallationRepoPort} from "../port/projectInstallation.repo.port";

export class UpdateProjectInstallationItemUseCase {
  constructor(private readonly repo: ProjectInstallationRepoPort) {}

  async execute(
    itemId: string,
    input: UpdateProjectInstallationItemInput,
  ): Promise<ProjectInstallationItem> {
    const existing = await this.repo.getItemById(itemId);

    if (!existing) {
      throw new Error("Project installation item not found");
    }

    const item = await this.repo.updateItem(itemId, input);
    await this.repo.updateDerivedState(existing.installationId);

    return item;
  }
}
