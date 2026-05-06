import type {ProjectInstallationRepoPort} from "../port/projectInstallation.repo.port";
import {GetProjectInstallationUseCase} from "./get-project-installation.usecase";
import {UpdateProjectInstallationUseCase} from "./update-project-installation.usecase";
import {CreateProjectInstallationItemUseCase} from "./create-project-installation-item.usecase";
import {UpdateProjectInstallationItemUseCase} from "./update-project-installation-item.usecase";
import {DeleteProjectInstallationItemUseCase} from "./delete-project-installation-item.usecase";

export {
  GetProjectInstallationUseCase,
  UpdateProjectInstallationUseCase,
  CreateProjectInstallationItemUseCase,
  UpdateProjectInstallationItemUseCase,
  DeleteProjectInstallationItemUseCase,
};

export function makeProjectInstallationUseCases(
  repo: ProjectInstallationRepoPort,
) {
  return {
    getProjectInstallation: new GetProjectInstallationUseCase(repo),
    updateProjectInstallation: new UpdateProjectInstallationUseCase(repo),
    createProjectInstallationItem: new CreateProjectInstallationItemUseCase(
      repo,
    ),
    updateProjectInstallationItem: new UpdateProjectInstallationItemUseCase(
      repo,
    ),
    deleteProjectInstallationItem: new DeleteProjectInstallationItemUseCase(
      repo,
    ),
  };
}
