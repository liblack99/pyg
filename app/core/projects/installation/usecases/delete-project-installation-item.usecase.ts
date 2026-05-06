import type {ProjectInstallationRepoPort} from "../port/projectInstallation.repo.port";

export class DeleteProjectInstallationItemUseCase {
  constructor(private readonly repo: ProjectInstallationRepoPort) {}

  async execute(itemId: string): Promise<void> {
    const existing = await this.repo.getItemById(itemId);

    if (!existing) {
      throw new Error("Project installation item not found");
    }

    await this.repo.deleteItem(itemId);
    await this.repo.updateDerivedState(existing.installationId);
  }
}
