import type {
  ProjectFabricationWithItems,
  UpdateProjectFabricationInput,
} from "../dto";
import type {ProjectFabricationRepoPort} from "../port/projectFabrication.repo.port";

export class UpdateProjectFabricationUseCase {
  constructor(private readonly repo: ProjectFabricationRepoPort) {}

  async execute(
    fabricationId: string,
    input: UpdateProjectFabricationInput,
  ): Promise<ProjectFabricationWithItems> {
    const existing = await this.repo.getById(fabricationId);

    if (!existing) {
      throw new Error("Project fabrication not found");
    }

    return this.repo.update(fabricationId, input);
  }
}
