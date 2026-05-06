import type {
  FabricationItemStatus,
  ProjectFabricationItem,
  ProjectFabricationStatus,
} from "@/app/core/projects/fabrication/dto";
import {
  FABRICATION_ITEM_STATUS_LABELS,
  PROJECT_FABRICATION_STATUS_LABELS,
} from "@/app/core/projects/fabrication/constants/status-labels";

export function getProjectFabricationStatusLabel(
  status: ProjectFabricationStatus,
): string {
  return PROJECT_FABRICATION_STATUS_LABELS[status];
}

export function getFabricationItemStatusLabel(
  status: FabricationItemStatus,
): string {
  return FABRICATION_ITEM_STATUS_LABELS[status];
}

export function getProjectFabricationStatusBadgeClass(
  status: ProjectFabricationStatus,
): string {
  switch (status) {
    case "NOT_STARTED":
      return "bg-slate-100 text-slate-700 border border-slate-200";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "PAUSED":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 border border-rose-200";
  }
}

export function getFabricationItemStatusBadgeClass(
  status: FabricationItemStatus,
): string {
  switch (status) {
    case "PENDING":
      return "bg-slate-100 text-slate-700 border border-slate-200";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "PAUSED":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 border border-rose-200";
  }
}

export function countItemsByStatus(
  items: ProjectFabricationItem[],
  status: FabricationItemStatus,
): number {
  return items.filter((item) => item.status === status).length;
}
