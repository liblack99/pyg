export const PROJECT_INSTALLATION_STATUSES = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
] as const;

export type ProjectInstallationStatus =
  (typeof PROJECT_INSTALLATION_STATUSES)[number];

export const INSTALLATION_ITEM_STATUSES = [
  "PENDING",
  "IN_PROGRESS",
  "BLOCKED",
  "COMPLETED",
  "CANCELLED",
] as const;

export type InstallationItemStatus = (typeof INSTALLATION_ITEM_STATUSES)[number];

export type ProjectInstallation = {
  id: string;
  projectId: string;
  status: ProjectInstallationStatus;
  responsible: string | null;
  summary: string | null;
  notes: string | null;
  plannedStartAt: string | null;
  plannedEndAt: string | null;
  actualStartAt: string | null;
  actualEndAt: string | null;
  progressPercent: number;
  createdAt: string;
  updatedAt: string;
};

export type ProjectInstallationItem = {
  id: string;
  installationId: string;
  name: string;
  description: string | null;
  status: InstallationItemStatus;
  responsible: string | null;
  plannedAt: string | null;
  completedAt: string | null;
  notes: string | null;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
};

export type ProjectInstallationWithItems = ProjectInstallation & {
  items: ProjectInstallationItem[];
};

export type ProjectInstallationProjectRef = {
  id: string;
  code: string;
  status: string;
  responsible: string | null;
};

export type ProjectInstallationDetail = ProjectInstallation & {
  items: ProjectInstallationItem[];
  project: ProjectInstallationProjectRef;
};

export type UpdateProjectInstallationInput = {
  status?: ProjectInstallationStatus;
  responsible?: string | null;
  summary?: string | null;
  notes?: string | null;
  plannedStartAt?: string | null;
  plannedEndAt?: string | null;
  actualStartAt?: string | null;
  actualEndAt?: string | null;
  progressPercent?: number;
};

export type CreateProjectInstallationItemInput = {
  installationId: string;
  name: string;
  description?: string | null;
  status?: InstallationItemStatus;
  responsible?: string | null;
  plannedAt?: string | null;
  completedAt?: string | null;
  orderIndex?: number;
  notes?: string | null;
};

export type UpdateProjectInstallationItemInput = {
  name?: string;
  description?: string | null;
  status?: InstallationItemStatus;
  responsible?: string | null;
  plannedAt?: string | null;
  completedAt?: string | null;
  orderIndex?: number;
  notes?: string | null;
};
