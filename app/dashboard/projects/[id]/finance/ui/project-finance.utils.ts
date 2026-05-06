import type {
  ProjectFinanceAlertTone,
  ProjectFinanceEntryCategory,
  ProjectFinanceEntryStatus,
  ProjectFinanceEntryType,
} from "@/app/core/projects/finance/dto";
import {
  PROJECT_FINANCE_ENTRY_CATEGORY_LABELS,
  PROJECT_FINANCE_ENTRY_STATUS_LABELS,
  PROJECT_FINANCE_ENTRY_TYPE_LABELS,
} from "@/app/core/projects/finance/constants/labels";

export function getFinanceEntryTypeLabel(type: ProjectFinanceEntryType): string {
  return PROJECT_FINANCE_ENTRY_TYPE_LABELS[type];
}

export function getFinanceEntryCategoryLabel(
  category: ProjectFinanceEntryCategory,
): string {
  return PROJECT_FINANCE_ENTRY_CATEGORY_LABELS[category];
}

export function getFinanceEntryStatusLabel(
  status: ProjectFinanceEntryStatus,
): string {
  return PROJECT_FINANCE_ENTRY_STATUS_LABELS[status];
}

export function getFinanceEntryTypeBadgeClass(type: ProjectFinanceEntryType) {
  switch (type) {
    case "COLLECTION":
    case "EXTRA_INCOME":
    case "ADJUSTMENT_POSITIVE":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "PAYMENT":
    case "EXTRA_EXPENSE":
    case "ADJUSTMENT_NEGATIVE":
      return "bg-rose-50 text-rose-700 border border-rose-200";
  }
}

export function getFinanceEntryStatusBadgeClass(status: ProjectFinanceEntryStatus) {
  switch (status) {
    case "VOID":
      return "bg-slate-100 text-slate-600 border border-slate-200";
    default:
      return "bg-blue-50 text-blue-700 border border-blue-200";
  }
}

export function getFinanceAlertClass(tone: ProjectFinanceAlertTone): string {
  switch (tone) {
    case "danger":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    default:
      return "border-blue-200 bg-blue-50 text-blue-700";
  }
}

export function getMarginVariant(marginPercent: number) {
  if (marginPercent < 10) return "rose" as const;
  if (marginPercent < 20) return "amber" as const;
  return "emerald" as const;
}
