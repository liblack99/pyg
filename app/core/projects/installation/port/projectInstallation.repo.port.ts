import type {
  CreateProjectInstallationItemInput,
  ProjectInstallationDetail,
  ProjectInstallationItem,
  ProjectInstallationWithItems,
  UpdateProjectInstallationInput,
  UpdateProjectInstallationItemInput,
} from "../dto";

export interface ProjectInstallationRepoPort {
  getByProjectId(projectId: string): Promise<ProjectInstallationDetail | null>;
  getById(
    installationId: string,
  ): Promise<ProjectInstallationWithItems | null>;
  existsByProjectId(projectId: string): Promise<boolean>;
  update(
    installationId: string,
    input: UpdateProjectInstallationInput,
  ): Promise<ProjectInstallationWithItems>;
  listItems(installationId: string): Promise<ProjectInstallationItem[]>;
  getItemById(itemId: string): Promise<ProjectInstallationItem | null>;
  createItem(
    input: CreateProjectInstallationItemInput,
  ): Promise<ProjectInstallationItem>;
  updateItem(
    itemId: string,
    input: UpdateProjectInstallationItemInput,
  ): Promise<ProjectInstallationItem>;
  deleteItem(itemId: string): Promise<void>;
  updateDerivedState(
    installationId: string,
  ): Promise<ProjectInstallationWithItems>;
}
