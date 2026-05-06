"use client";

import {FileBadge2, FolderOpen, ShieldCheck} from "lucide-react";
import {DashboardStatCard} from "@/app/dashboard/components/DashboardStatCard";
import {useProjectDocuments} from "../../documents/hooks/useProjectDocuments";
import {ProjectDocumentMultiTypeSection} from "../../documents/components/ProjectDocumentMultiTypeSection";

type Props = {
  projectId: string;
  projectCode: string;
};

const WARRANTY_EVIDENCE_ITEMS = [
  {
    type: "WARRANTY_EVIDENCE" as const,
    label: "Evidencias de garantía",
    description: "Sube fotos, registros y evidencias relacionadas con los casos de garantía.",
  },
  {
    type: "WARRANTY_SUPPORT" as const,
    label: "Soportes de garantía",
    description: "Adjunta soportes, respuestas, cierres, reportes y documentos de respaldo.",
  },
];

export function ProjectWarrantyEvidenceSection({
  projectId,
  projectCode,
}: Props) {
  const {documents, loading, error, refresh} = useProjectDocuments(projectId);

  const warrantyDocuments = documents.filter((document) =>
    WARRANTY_EVIDENCE_ITEMS.some((item) => item.type === document.type),
  );

  const categoriesWithFiles = WARRANTY_EVIDENCE_ITEMS.filter((item) =>
    warrantyDocuments.some(
      (document) => document.type === item.type && document.status !== "VOID",
    ),
  ).length;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardStatCard
          title="Categorías"
          value={WARRANTY_EVIDENCE_ITEMS.length}
          icon={FileBadge2}
          variant="blue"
          hint={<span className="text-slate-500">Tipos documentales disponibles</span>}
        />

        <DashboardStatCard
          title="Archivos cargados"
          value={warrantyDocuments.length}
          icon={ShieldCheck}
          variant="emerald"
          hint={<span className="font-bold text-emerald-600">Soportes visibles en la app</span>}
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
          <p className="text-sm text-slate-500">Cargando soportes de garantía...</p>
        </section>
      ) : error ? (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
          <p className="text-sm text-rose-700">{error}</p>
        </section>
      ) : (
        <ProjectDocumentMultiTypeSection
          title="Evidencias y soportes de garantía"
          description="Usa este bloque para cargar múltiples evidencias y soportes de la gestión de garantías del proyecto."
          items={WARRANTY_EVIDENCE_ITEMS}
          documents={warrantyDocuments}
          projectId={projectId}
          projectCode={projectCode}
          onRefresh={refresh}
        />
      )}
    </div>
  );
}
