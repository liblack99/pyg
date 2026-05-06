import type {ProjectFabricationRepoPort} from "../port/projectFabrication.repo.port";

import {GetProjectFabricationUseCase} from "./get-project-Fabrication.usecase";
import {UpdateProjectFabricationUseCase} from "./update-project-fabrication.usecase";
import {CreateProjectFabricationItemUseCase} from "./create-project-fabrication-item.usecase";
import {UpdateProjectFabricationItemUseCase} from "./update-project-fabrication-item.usecase";
import {DeleteProjectFabricationItemUseCase} from "./delete-project-fabrication-item.usecase";

export {
  GetProjectFabricationUseCase,
  UpdateProjectFabricationUseCase,
  CreateProjectFabricationItemUseCase,
  UpdateProjectFabricationItemUseCase,
  DeleteProjectFabricationItemUseCase,
};

export function makeProjectFabricationUseCases(
  repo: ProjectFabricationRepoPort,
) {
  return {
    getProjectFabrication: new GetProjectFabricationUseCase(repo),
    updateProjectFabrication: new UpdateProjectFabricationUseCase(repo),
    createProjectFabricationItem: new CreateProjectFabricationItemUseCase(repo),
    updateProjectFabricationItem: new UpdateProjectFabricationItemUseCase(repo),
    deleteProjectFabricationItem: new DeleteProjectFabricationItemUseCase(repo),
  };
}
