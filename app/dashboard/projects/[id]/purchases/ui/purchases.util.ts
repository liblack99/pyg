import type {ProcurementStatus} from "@/app/core/projects/purchases/dto";

export function statusPillClass(s: ProcurementStatus) {
  if (s === "RECEIVED")
    return "bg-emerald-50 text-emerald-600 border-emerald-100";
  if (s === "ORDERED") return "bg-blue-50 text-blue-600 border-blue-100";
  if (s === "PENDING") return "bg-amber-50 text-amber-600 border-amber-100";
  return "bg-slate-50 text-slate-500 border-slate-100";
}
