"use client";
import type {QuotationStatus} from "@/app/core/quotations/dto";

const STATUS_CONFIG: Record<
  QuotationStatus,
  {
    label: string;
    className: string;
    dot: string;
  }
> = {
  DRAFT: {
    label: "Borrador",
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    dot: "bg-slate-400",
  },
  SENT: {
    label: "Enviada",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  APPROVED: {
    label: "Aprobada",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rechazada",
    className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    dot: "bg-red-500",
  },
  EXPIRED: {
    label: "Vencida",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  CANCELLED: {
    label: "Cancelada",
    className:
      "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
    dot: "bg-neutral-500",
  },
};

export function StatusBadge({
  status,
  compact = false,
}: {
  status: QuotationStatus;
  compact?: boolean;
}) {
  const cfg = STATUS_CONFIG[status];

  if (!cfg) return null;

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full font-medium",
        compact ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        cfg.className,
      ].join(" ")}
      title={cfg.label}>
      <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
