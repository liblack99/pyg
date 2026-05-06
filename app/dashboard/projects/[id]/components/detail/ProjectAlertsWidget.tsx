"use client";

import LoadingSection from "@/app/components/ui/LoadingSection";
import ErrorSection from "@/app/components/ui/ErrorSection";
import type {ProjectAlertView} from "@/app/core/projects/activity/dto";
import {ProjectAlertCard} from "./ProjectAlertCard";

type Props = {
  alerts: ProjectAlertView[];
  loading: boolean;
  error: string | null;
  savingAlertId: string | null;
  onResolve: (alertId: string) => void | Promise<void>;
  onDismiss: (alertId: string) => void | Promise<void>;
};

export function ProjectAlertsWidget({
  alerts,
  loading,
  error,
  savingAlertId,
  onResolve,
  onDismiss,
}: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-slate-900">
          Alertas del proyecto
        </h2>
        <p className="text-sm text-slate-500">
          Senales activas que requieren seguimiento y te llevan al tab correcto.
        </p>
      </div>

      {loading ? <LoadingSection message="Cargando alertas..." /> : null}
      {!loading && error ? <ErrorSection message={error} /> : null}

      {!loading && !error ? (
        alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <ProjectAlertCard
                key={alert.id}
                alert={alert}
                busy={savingAlertId === alert.id}
                onResolve={onResolve}
                onDismiss={onDismiss}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
            <p className="text-sm font-medium text-slate-700">
              No hay alertas activas.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              El proyecto no presenta senales operativas relevantes por ahora.
            </p>
          </div>
        )
      ) : null}
    </section>
  );
}
