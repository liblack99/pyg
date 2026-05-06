"use client";

import LoadingSection from "@/app/components/ui/LoadingSection";
import ErrorSection from "@/app/components/ui/ErrorSection";
import type {ProjectEventView} from "@/app/core/projects/activity/dto";
import {ProjectEventItem} from "./ProjectEventItem";

type Props = {
  events: ProjectEventView[];
  loading: boolean;
  error: string | null;
};

export function ProjectRecentActivityWidget({events, loading, error}: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">
          Actividad reciente
        </h2>
        <p className="text-sm text-slate-500">
          Historial compacto de movimientos importantes dentro del proyecto.
        </p>
      </div>

      {loading ? <LoadingSection message="Cargando actividad..." /> : null}
      {!loading && error ? <ErrorSection message={error} /> : null}

      {!loading && !error ? (
        events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event) => (
              <ProjectEventItem key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
            <p className="text-sm font-medium text-slate-700">
              Aun no hay actividad registrada.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Los eventos del proyecto iran apareciendo aqui a medida que
              avance.
            </p>
          </div>
        )
      ) : null}
    </section>
  );
}
