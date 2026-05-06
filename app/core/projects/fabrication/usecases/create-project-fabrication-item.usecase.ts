import type {
  CreateProjectFabricationItemInput,
  ProjectFabricationItem,
} from "../dto";
import type {ProjectFabricationRepoPort} from "../port/projectFabrication.repo.port";

export class CreateProjectFabricationItemUseCase {
  constructor(private readonly repo: ProjectFabricationRepoPort) {}

  async execute(
    input: CreateProjectFabricationItemInput,
  ): Promise<ProjectFabricationItem> {
    const fabrication = await this.repo.getById(input.fabricationId);

    if (!fabrication) {
      throw new Error("Project fabrication not found");
    }

    const item = await this.repo.createItem(input);

    await this.repo.updateDerivedState(input.fabricationId);

    return item;
  }
}
