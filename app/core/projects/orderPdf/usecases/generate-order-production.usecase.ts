import {ProjectRepoPort} from "../../port/project.repo.port";
import type {ProductionOrderInput} from "../dto";

export class GenerateOrderProductionUseCase {
  constructor(private readonly repo: ProjectRepoPort) {}

  async execute(id: string, input: ProductionOrderInput) {
    return this.repo.productionOrderNeeds(id, input);
  }
}
