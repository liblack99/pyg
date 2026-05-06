"use client";

import Link from "next/link";
import {Clock3, ExternalLink} from "lucide-react";
import type {ProjectEventView} from "@/app/core/projects/activity/dto";
import {PROJECT_MODULE_LABELS} from "@/app/core/projects/activity/dto";

function formatRelative(dateIso: string) {
  const diffMs = Date.now() - new Date(dateIso).getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / (1000 * 60)));

  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;

  const diffDays = Math.round(diffHours / 24);
  return `Hace ${diffDays} d`;
}

export function ProjectEventItem({event}: {event: ProjectEventView}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm animate-zoom-in">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              {PROJECT_MODULE_LABELS[event.module]}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock3 className="h-3.5 w-3.5" />
              {formatRelative(event.createdAt)}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-slate-900">
            {event.title}
          </h3>
          <p className="text-sm text-slate-600">
            {event.description ?? "Actividad registrada dentro del proyecto."}
          </p>
          <p className="text-xs text-slate-400">
            {event.createdByName ? `Por ${event.createdByName}` : "Sistema"}
          </p>
        </div>

        <Link
          href={event.href}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          title="Abrir modulo relacionado">
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
