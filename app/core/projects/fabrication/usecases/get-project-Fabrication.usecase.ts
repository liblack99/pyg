import type {ProjectFabricationDetail} from "../dto";
import type {ProjectFabricationRepoPort} from "../port/projectFabrication.repo.port";

export class GetProjectFabricationUseCase {
  constructor(private readonly repo: ProjectFabricationRepoPort) {}

  async execute(projectId: string): Promise<ProjectFabricationDetail> {
    const fabrication = await this.repo.getByProjectId(projectId);

    if (!fabrication) {
      throw new Error("Project fabrication not found");
    }

    return fabrication;
  }
}
