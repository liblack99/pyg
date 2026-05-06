import type {
  InstallationItemStatus,
  ProjectInstallationItem,
  ProjectInstallationStatus,
} from "@/app/core/projects/installation/dto";
import {
  INSTALLATION_ITEM_STATUS_LABELS,
  PROJECT_INSTALLATION_STATUS_LABELS,
} from "@/app/core/projects/installation/constants/status-labels";

export function getProjectInstallationStatusLabel(
  status: ProjectInstallationStatus,
): string {
  return PROJECT_INSTALLATION_STATUS_LABELS[status];
}

export function getInstallationItemStatusLabel(
  status: InstallationItemStatus,
): string {
  return INSTALLATION_ITEM_STATUS_LABELS[status];
}

export function getProjectInstallationStatusBadgeClass(
  status: ProjectInstallationStatus,
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

export function getInstallationItemStatusBadgeClass(
  status: InstallationItemStatus,
): string {
  switch (status) {
    case "PENDING":
      return "bg-slate-100 text-slate-700 border border-slate-200";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "BLOCKED":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 border border-rose-200";
  }
}

export function countInstallationItemsByStatus(
  items: ProjectInstallationItem[],
  status: InstallationItemStatus,
): number {
  return items.filter((item) => item.status === status).length;
}
