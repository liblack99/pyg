"use client";

import {Camera, FileBadge2, FolderOpen} from "lucide-react";
import {DashboardStatCard} from "@/app/dashboard/components/DashboardStatCard";
import {useProjectDocuments} from "../../documents/hooks/useProjectDocuments";
import {ProjectDocumentMultiTypeSection} from "../../documents/components/ProjectDocumentMultiTypeSection";

type Props = {
  projectId: string;
  projectCode: string;
};

const INSTALLATION_EVIDENCE_ITEMS = [
  {
    type: "INSTALLATION_PHOTO" as const,
    label: "Fotos de avance",
    description: "Sube todas las fotos necesarias del avance o cierre de la instalación.",
  },
  {
    type: "INSTALLATION_RECORD" as const,
    label: "Actas de instalación",
    description: "Puedes adjuntar una o varias actas relacionadas con la instalación.",
  },
  {
    type: "INSTALLATION_SUPPORT" as const,
    label: "Soportes de instalación",
    description: "Adjunta soportes, reportes, novedades y evidencias complementarias.",
  },
];

export function ProjectInstallationEvidenceSection({
  projectId,
  projectCode,
}: Props) {
  const {documents, loading, error, refresh} = useProjectDocuments(projectId);

  const evidenceDocuments = documents.filter((document) =>
    INSTALLATION_EVIDENCE_ITEMS.some((item) => item.type === document.type),
  );

  const categoriesWithFiles = INSTALLATION_EVIDENCE_ITEMS.filter((item) =>
    evidenceDocuments.some(
      (document) => document.type === item.type && document.status !== "VOID",
    ),
  ).length;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardStatCard
          title="Categorías"
          value={INSTALLATION_EVIDENCE_ITEMS.length}
          icon={FileBadge2}
          variant="blue"
          hint={<span className="text-slate-500">Tipos documentales disponibles</span>}
        />

        <DashboardStatCard
          title="Archivos cargados"
          value={evidenceDocuments.length}
          icon={Camera}
          variant="emerald"
          hint={<span className="font-bold text-emerald-600">Evidencias visibles en la app</span>}
        />

        <DashboardStatCard
          title="Categorías con archivos"
          value={categoriesWithFiles}
          icon={FolderOpen}
          variant="amber"
          hint={<span className="text-amber-600">Cobertura documental</span>}
        />
      </div>

      {loading ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Cargando evidencias...</p>
        </section>
      ) : error ? (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
          <p className="text-sm text-rose-700">{error}</p>
        </section>
      ) : (
        <ProjectDocumentMultiTypeSection
          title="Evidencias de instalación"
          description="Reutiliza el flujo documental del proyecto para cargar múltiples fotos, actas y soportes asociados a la instalación."
          items={INSTALLATION_EVIDENCE_ITEMS}
          documents={evidenceDocuments}
          projectId={projectId}
          projectCode={projectCode}
          onRefresh={refresh}
        />
      )}
    </div>
  );
}
