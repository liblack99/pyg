"use client";

import LoadingSection from "@/app/components/ui/LoadingSection";
import ErrorSection from "@/app/components/ui/ErrorSection";
import {useProjectInstallation} from "../hooks/useProjectInstallation";
import {ProjectInstallationSummaryCards} from "./ProjectInstallationSummaryCards";
import {ProjectInstallationOverviewCard} from "./ProjectInstallationOverviewCard";
import {ProjectInstallationEditDialog} from "./ProjectInstallationEditDialog";
import {ProjectInstallationItemsSection} from "./ProjectInstallationItemsSection";
import {ProjectInstallationEvidenceSection} from "./ProjectInstallationEvidenceSection";

type Props = {
  projectId: string;
};

export function ProjectInstallation({projectId}: Props) {
  const {installation, loading, error, reloadInstallation} =
    useProjectInstallation(projectId);

  if (loading) {
    return <LoadingSection message="Cargando instalación..." />;
  }

  if (error) {
    return <ErrorSection message={error} />;
  }

  if (!installation) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-slate-500">
          No se encontró información de instalación para este proyecto.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <ProjectInstallationSummaryCards installation={installation} />
      <ProjectInstallationOverviewCard installation={installation} />
      <ProjectInstallationEditDialog />

      <ProjectInstallationItemsSection
        projectId={projectId}
        installationId={installation.id}
        items={installation.items}
        onReload={() => reloadInstallation({silent: true})}
      />

      <ProjectInstallationEvidenceSection
        projectId={projectId}
        projectCode={installation.project.code}
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Avance de instalación
          </h3>
          <span className="text-sm font-semibold text-blue-600">
            {installation.progressPercent}%
          </span>
        </div>

        <div className="h-3 rounded-full bg-slate-100">
          <div
            className="h-3 rounded-full bg-blue-600 transition-all"
            style={{width: `${installation.progressPercent}%`}}
          />
        </div>
      </section>
    </div>
  );
}
