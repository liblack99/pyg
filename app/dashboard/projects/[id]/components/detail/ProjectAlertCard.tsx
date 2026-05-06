"use client";

import Link from "next/link";
import {AlertTriangle, Bell, ChevronRight, ShieldAlert} from "lucide-react";
import Button from "@/app/components/ui/Button";
import type {ProjectAlertView} from "@/app/core/projects/activity/dto";
import {PROJECT_MODULE_LABELS} from "@/app/core/projects/activity/dto";

type Props = {
  alert: ProjectAlertView;
  busy: boolean;
  onResolve: (alertId: string) => void | Promise<void>;
  onDismiss: (alertId: string) => void | Promise<void>;
};

const severityStyles = {
  INFO: {
    card: "border-sky-200 bg-sky-50/50",
    badge: "bg-sky-100 text-sky-700",
    icon: Bell,
  },
  WARNING: {
    card: "border-amber-200 bg-amber-50/50",
    badge: "bg-amber-100 text-amber-700",
    icon: ShieldAlert,
  },
  CRITICAL: {
    card: "border-rose-200 bg-rose-50/60",
    badge: "bg-rose-100 text-rose-700",
    icon: AlertTriangle,
  },
} as const;

export function ProjectAlertCard({alert, busy, onResolve, onDismiss}: Props) {
  const Icon = severityStyles[alert.severity].icon;

  return (
    <article
      className={`rounded-2xl  border p-4 shadow-sm ${severityStyles[alert.severity].card} animate-zoom-in`}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${severityStyles[alert.severity].badge}`}>
              {alert.severity === "CRITICAL"
                ? "Critica"
                : alert.severity === "WARNING"
                  ? "Atencion"
                  : "Info"}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {PROJECT_MODULE_LABELS[alert.module]}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-slate-900">
            {alert.title}
          </h3>
          <p className="text-sm text-slate-600">
            {alert.description ??
              "Esta alerta requiere revision en el proyecto."}
          </p>
        </div>
        <Icon className="mt-0.5 h-4 w-4 flex-none text-slate-500" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link
          href={alert.href}
          className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50">
          Ir al modulo
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>

        <Button
          variant="outline"
          className="px-3 py-1.5 text-xs"
          disabled={busy}
          onClick={() => onResolve(alert.id)}>
          Resolver
        </Button>

        <Button
          variant="secondary"
          className="px-3 py-1.5 text-xs"
          disabled={busy}
          onClick={() => onDismiss(alert.id)}>
          Descartar
        </Button>
      </div>
    </article>
  );
}
