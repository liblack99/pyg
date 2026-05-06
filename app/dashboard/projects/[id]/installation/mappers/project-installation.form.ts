import type {
  CreateProjectInstallationItemInput,
  ProjectInstallationDetail,
  UpdateProjectInstallationInput,
  UpdateProjectInstallationItemInput,
} from "@/app/core/projects/installation/dto";

export function buildInstallationFormDefaults(
  installation: ProjectInstallationDetail,
): UpdateProjectInstallationInput {
  return {
    status: installation.status,
    responsible: installation.responsible ?? null,
    summary: installation.summary ?? null,
    notes: installation.notes ?? null,
    plannedStartAt: installation.plannedStartAt,
    plannedEndAt: installation.plannedEndAt,
    actualStartAt: installation.actualStartAt,
    actualEndAt: installation.actualEndAt,
    progressPercent: installation.progressPercent,
  };
}

export function buildCreateInstallationItem(
  values: CreateProjectInstallationItemInput,
) {
  return {
    installationId: values.installationId,
    name: values.name,
    description: values.description ?? null,
    status: values.status,
    responsible: values.responsible ?? null,
    plannedAt: values.plannedAt ?? null,
    completedAt: values.completedAt ?? null,
    orderIndex: values.orderIndex,
    notes: values.notes ?? null,
  };
}

export function buildUpdateInstallationItem(
  item: UpdateProjectInstallationItemInput,
): UpdateProjectInstallationItemInput {
  return {
    name: item.name,
    description: item.description ?? null,
    status: item.status,
    responsible: item.responsible ?? null,
    plannedAt: item.plannedAt,
    completedAt: item.completedAt,
    orderIndex: item.orderIndex,
    notes: item.notes ?? null,
  };
}
