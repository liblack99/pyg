import type {ProjectFabricationRepoPort} from "../port/projectFabrication.repo.port";

export class DeleteProjectFabricationItemUseCase {
  constructor(private readonly repo: ProjectFabricationRepoPort) {}

  async execute(itemId: string): Promise<void> {
    const existing = await this.repo.getItemById(itemId);

    if (!existing) {
      throw new Error("Project fabrication item not found");
    }

    await this.repo.deleteItem(itemId);
    await this.repo.updateDerivedState(existing.fabricationId);
  }
}
