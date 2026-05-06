"use client";

import {ProjectFabricationSummaryCards} from "./ProjectFabricationSummaryCards";
import {ProjectFabricationOverviewCard} from "./ProjectFabricationOverviewCard";
import {ProjectFabricationEditDialog} from "./ProjectFabricationEditDialog";
import {ProjectFabricationItemsSection} from "./ProjectFabricationItemsSection";
import LoadingSection from "@/app/components/ui/LoadingSection";
import ErrorSection from "@/app/components/ui/ErrorSection";
import {useProjectFabrication} from "../hooks/useProjectFabrication";

type Props = {
  projectId: string;
};

export function ProjectFabrication({projectId}: Props) {
  const {fabrication, loading, error, reloadFabrication} =
    useProjectFabrication(projectId);

  if (loading) {
    return <LoadingSection message="Cargando fabricación…" />;
  }

  if (error) {
    return <ErrorSection message={error} />;
  }

  if (!fabrication) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-slate-500">
          No se encontró información de fabricación para este proyecto.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ProjectFabricationSummaryCards fabrication={fabrication} />

      <ProjectFabricationOverviewCard fabrication={fabrication} />

      {/* 🔥 UNA sola vez en el árbol */}
      <ProjectFabricationEditDialog />

      <ProjectFabricationItemsSection
        projectId={projectId}
        fabricationId={fabrication.id}
        items={fabrication.items}
        onReload={() => reloadFabrication({silent: true})}
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Ejecución de fabricación
          </h3>
          <span className="text-sm font-semibold text-blue-600">
            {fabrication.progressPercent}%
          </span>
        </div>

        <div className="h-3 rounded-full bg-slate-100">
          <div
            className="h-3 rounded-full bg-blue-600 transition-all"
            style={{width: `${fabrication.progressPercent}%`}}
          />
        </div>
      </section>
    </div>
  );
}
