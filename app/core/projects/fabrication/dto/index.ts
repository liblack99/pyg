export const PROJECT_FABRICATION_STATUSES = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
] as const;

export type ProjectFabricationStatus =
  (typeof PROJECT_FABRICATION_STATUSES)[number];

export const FABRICATION_ITEM_STATUSES = [
  "PENDING",
  "IN_PROGRESS",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
] as const;

export type FabricationItemStatus = (typeof FABRICATION_ITEM_STATUSES)[number];

export type ProjectFabrication = {
  id: string;
  projectId: string;
  status: ProjectFabricationStatus;
  title: string | null;
  description: string | null;
  notes: string | null;
  plannedStartAt: string | null;
  plannedEndAt: string | null;
  actualStartAt: string | null;
  actualEndAt: string | null;
  progressPercent: number;
  createdById: string | null;
  updatedById: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectFabricationItem = {
  id: string;
  fabricationId: string;
  name: string;
  description: string | null;
  unit: string | null;
  quantity: string | null;
  status: FabricationItemStatus;
  plannedStartAt: string | null;
  plannedEndAt: string | null;
  actualStartAt: string | null;
  actualEndAt: string | null;
  orderIndex: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectFabricationWithItems = ProjectFabrication & {
  items: ProjectFabricationItem[];
};

export type ProjectFabricationProjectRef = {
  id: string;
  code: string;
  status: string;
};

export type ProjectFabricationDetail = ProjectFabrication & {
  items: ProjectFabricationItem[];
  project: ProjectFabricationProjectRef;
};

export type UpdateProjectFabricationInput = {
  title?: string | null;
  description?: string | null;
  notes?: string | null;
  status?: ProjectFabricationStatus;
  plannedStartAt?: string | null;
  plannedEndAt?: string | null;
  actualStartAt?: string | null;
  actualEndAt?: string | null;
  progressPercent?: number;
  updatedById?: string | null;
};

export type CreateProjectFabricationItemInput = {
  fabricationId: string;
  name: string;
  description?: string | null;
  unit?: string | null;
  quantity?: string | null;
  status?: FabricationItemStatus;
  plannedStartAt?: string | null;
  plannedEndAt?: string | null;
  actualStartAt?: string | null;
  actualEndAt?: string | null;
  orderIndex?: number;
  notes?: string | null;
};

export type UpdateProjectFabricationItemInput = {
  name?: string;
  description?: string | null;
  unit?: string | null;
  quantity?: string | null;
  status?: FabricationItemStatus;
  plannedStartAt?: string | null;
  plannedEndAt?: string | null;
  actualStartAt?: string | null;
  actualEndAt?: string | null;
  orderIndex?: number;
  notes?: string | null;
};

export type FabricationItemsListQuery = {
  fabricationId: string;
  status?: FabricationItemStatus;
  search?: string;
};
