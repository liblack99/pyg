import type {
  ProjectFabricationItem,
  UpdateProjectFabricationItemInput,
} from "../dto";
import type {ProjectFabricationRepoPort} from "../port/projectFabrication.repo.port";

export class UpdateProjectFabricationItemUseCase {
  constructor(private readonly repo: ProjectFabricationRepoPort) {}

  async execute(
    itemId: string,
    input: UpdateProjectFabricationItemInput,
  ): Promise<ProjectFabricationItem> {
    const existing = await this.repo.getItemById(itemId);

    if (!existing) {
      throw new Error("Project fabrication item not found");
    }

    const item = await this.repo.updateItem(itemId, input);

    await this.repo.updateDerivedState(item.fabricationId);

    return item;
  }
}
