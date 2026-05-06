// app/(dashboard)/projects/[id]/components/warranty/warranty.utils.ts

import type {
  ProjectWarrantyStatus,
  WarrantyCaseStatus,
  WarrantyCaseType,
  WarrantyResponsibility,
} from "@/app/core/projects/warranties/dto";
import {Decimal} from "@prisma/client/runtime/client";

export const PROJECT_WARRANTY_STATUS_LABELS: Record<
  ProjectWarrantyStatus,
  string
> = {
  NOT_APPLICABLE: "No aplica",
  PENDING: "Pendiente",
  ACTIVE: "Activa",
  EXPIRED: "Vencida",
  VOID: "Anulada",
};

export const WARRANTY_CASE_TYPE_LABELS: Record<WarrantyCaseType, string> = {
  MATERIAL: "Material",
  INSTALLATION: "Instalación",
  FINISH: "Acabado",
  ADJUSTMENT: "Ajuste",
  VISIT: "Visita",
  OTHER: "Otro",
};

export const WARRANTY_CASE_STATUS_LABELS: Record<WarrantyCaseStatus, string> = {
  OPEN: "Abierta",
  IN_PROGRESS: "En proceso",
  RESOLVED: "Resuelta",
  REJECTED: "Rechazada",
  CANCELLED: "Cancelada",
};

export const WARRANTY_RESPONSIBILITY_LABELS: Record<
  WarrantyResponsibility,
  string
> = {
  COMPANY: "Empresa",
  SUPPLIER: "Proveedor",
  CLIENT: "Cliente",
  MIXED: "Compartida",
  UNDEFINED: "Sin definir",
};

export function formatCop(
  value: number | string | null | undefined | Decimal,
): string {
  const amount =
    typeof value === "string"
      ? Number(value)
      : typeof value === "number"
        ? value
        : 0;

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
  }).format(date);
}

export function getProjectWarrantyStatusBadgeClass(
  status: ProjectWarrantyStatus,
): string {
  switch (status) {
    case "ACTIVE":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "PENDING":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "EXPIRED":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "VOID":
      return "border-slate-300 bg-slate-100 text-slate-700";
    case "NOT_APPLICABLE":
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

export function getWarrantyCaseStatusBadgeClass(
  status: WarrantyCaseStatus,
): string {
  switch (status) {
    case "OPEN":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "IN_PROGRESS":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "RESOLVED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "REJECTED":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "CANCELLED":
    default:
      return "border-slate-300 bg-slate-100 text-slate-700";
  }
}

export function getWarrantyResponsibilityBadgeClass(
  responsibility: WarrantyResponsibility,
): string {
  switch (responsibility) {
    case "COMPANY":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "SUPPLIER":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "CLIENT":
      return "border-orange-200 bg-orange-50 text-orange-700";
    case "MIXED":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "UNDEFINED":
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

export function getWarrantyCaseTypeBadgeClass(type: WarrantyCaseType): string {
  switch (type) {
    case "MATERIAL":
      return "border-cyan-200 bg-cyan-50 text-cyan-700";
    case "INSTALLATION":
      return "border-indigo-200 bg-indigo-50 text-indigo-700";
    case "FINISH":
      return "border-pink-200 bg-pink-50 text-pink-700";
    case "ADJUSTMENT":
      return "border-lime-200 bg-lime-50 text-lime-700";
    case "VISIT":
      return "border-teal-200 bg-teal-50 text-teal-700";
    case "OTHER":
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

export function toDateInputValue(
  value: string | Date | null | undefined,
): string {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
