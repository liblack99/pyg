import type {
  ProjectFabricationDetail,
  UpdateProjectFabricationItemInput,
  CreateProjectFabricationItemInput,
  UpdateProjectFabricationInput,
} from "@/app/core/projects/fabrication/dto";

export function buildFabricationFormDefaults(
  fabrication: ProjectFabricationDetail,
): UpdateProjectFabricationInput {
  return {
    title: fabrication.title ?? null,
    description: fabrication.description ?? null,
    notes: fabrication.notes ?? null,
    status: fabrication.status,
    plannedStartAt: fabrication.plannedStartAt,
    plannedEndAt: fabrication.plannedEndAt,
    actualStartAt: fabrication.actualStartAt,
    actualEndAt: fabrication.actualEndAt,
    progressPercent: fabrication.progressPercent,
    updatedById: fabrication.updatedById ?? null,
  };
}

export function buildCreateFabricationItemDefaults(
  fabricationId: string,
): CreateProjectFabricationItemInput {
  return {
    fabricationId,
    name: "",
    description: null,
    unit: null,
    quantity: null,
    status: "PENDING",
    plannedStartAt: null,
    plannedEndAt: null,
    actualStartAt: null,
    actualEndAt: null,
    orderIndex: 0,
    notes: null,
  };
}

export function buildCreateFabricationItem(
  values: CreateProjectFabricationItemInput,
) {
  return {
    fabricationId: values.fabricationId,
    name: values.name,
    description: values.description ?? null,
    unit: values.unit ?? null,
    quantity: values.quantity ?? null,
    status: values.status,
    plannedStartAt: values.plannedStartAt ?? null,
    plannedEndAt: values.plannedEndAt ?? null,
    actualStartAt: values.actualStartAt ?? null,
    actualEndAt: values.actualEndAt ?? null,
    orderIndex: values.orderIndex,
    notes: values.notes ?? null,
  };
}

export function buildUpdateFabricationItem(
  item: UpdateProjectFabricationItemInput,
): UpdateProjectFabricationItemInput {
  return {
    name: item.name,
    description: item.description ?? null,
    unit: item.unit ?? null,
    quantity: item.quantity ?? null,
    status: item.status,
    plannedStartAt: item.plannedStartAt,
    plannedEndAt: item.plannedEndAt,
    actualStartAt: item.actualStartAt,
    actualEndAt: item.actualEndAt,
    orderIndex: item.orderIndex,
    notes: item.notes ?? null,
  };
}
