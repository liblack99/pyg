import type {
  CreateProjectFabricationItemInput,
  FabricationItemsListQuery,
  ProjectFabricationDetail,
  ProjectFabricationItem,
  ProjectFabricationWithItems,
  UpdateProjectFabricationInput,
  UpdateProjectFabricationItemInput,
} from "../dto";

export interface ProjectFabricationRepoPort {
  getByProjectId(projectId: string): Promise<ProjectFabricationDetail | null>;

  getById(fabricationId: string): Promise<ProjectFabricationWithItems | null>;

  existsByProjectId(projectId: string): Promise<boolean>;

  update(
    fabricationId: string,
    input: UpdateProjectFabricationInput,
  ): Promise<ProjectFabricationWithItems>;

  listItems(fabricationId: string): Promise<ProjectFabricationItem[]>;

  getItemById(itemId: string): Promise<ProjectFabricationItem | null>;

  createItem(
    input: CreateProjectFabricationItemInput,
  ): Promise<ProjectFabricationItem>;

  updateItem(
    itemId: string,
    input: UpdateProjectFabricationItemInput,
  ): Promise<ProjectFabricationItem>;

  deleteItem(itemId: string): Promise<void>;

  updateDerivedState(
    fabricationId: string,
  ): Promise<ProjectFabricationWithItems>;
}
