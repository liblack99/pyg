import type {ProjectSummaryTone} from "@/app/core/projects/domain/project-summary.types";

export function summaryToneToTextClass(tone: ProjectSummaryTone): string {
  switch (tone) {
    case "danger":
      return "text-rose-600";
    case "warning":
      return "text-amber-600";
    case "success":
      return "text-emerald-600";
    default:
      return "text-slate-500";
  }
}

export function summaryToneToBorderClass(tone: ProjectSummaryTone): string {
  switch (tone) {
    case "danger":
      return "border-rose-200";
    case "warning":
      return "border-amber-200";
    case "success":
      return "border-emerald-200";
    default:
      return "border-slate-200";
  }
}

export function summaryToneToBarClass(tone: ProjectSummaryTone): string {
  switch (tone) {
    case "danger":
      return "bg-rose-500";
    case "warning":
      return "bg-amber-500";
    case "success":
      return "bg-emerald-500";
    default:
      return "bg-slate-400";
  }
}
