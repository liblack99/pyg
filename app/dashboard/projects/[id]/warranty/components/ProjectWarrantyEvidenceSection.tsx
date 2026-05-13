"use client";

import {FileBadge2, FolderOpen, ShieldCheck} from "lucide-react";
import {DashboardStatCard} from "@/app/dashboard/components/DashboardStatCard";
import {useProjectDocuments} from "../../documents/hooks/useProjectDocuments";
import {ProjectDocumentMultiTypeSection} from "../../documents/components/ProjectDocumentMultiTypeSection";
import type {ProjectDocumentEntity} from "@/app/core/projects/documents/dto";
import type {ProjectWarrantyCaseView} from "@/app/core/projects/warranties/dto";
import {WARRANTY_CASE_STATUS_LABELS} from "../ui/warranty.utils";

type Props = {
  projectId: string;
  projectCode: string;
  cases: ProjectWarrantyCaseView[];
};

const WARRANTY_EVIDENCE_ITEMS = [
  {
    type: "WARRANTY_EVIDENCE" as const,
    label: "Evidencias de garantia",
    description:
      "Sube fotos, registros y evidencias relacionadas con este caso de garantia.",
  },
  {
    type: "WARRANTY_SUPPORT" as const,
    label: "Soportes de garantia",
    description:
      "Adjunta soportes, respuestas, cierres, reportes y documentos de respaldo.",
  },
];

export function ProjectWarrantyEvidenceSection({
  projectId,
  projectCode,
  cases,
}: Props) {
  const {documents, loading, error, refresh} = useProjectDocuments(projectId);

  const openCases = cases.filter((item) =>
    ["OPEN", "IN_PROGRESS"].includes(item.status),
  );

  const warrantyDocuments = documents.filter((document) =>
    WARRANTY_EVIDENCE_ITEMS.some((item) => item.type === document.type),
  );

  const associatedDocuments = warrantyDocuments.filter(
    (document) => getWarrantyCaseId(document) !== null,
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardStatCard
          title="Tipos documentales"
          value={WARRANTY_EVIDENCE_ITEMS.length}
          icon={FileBadge2}
          variant="blue"
          hint={<span className="text-slate-500">Evidencias y soportes</span>}
        />

        <DashboardStatCard
          title="Casos abiertos"
          value={openCases.length}
          icon={ShieldCheck}
          variant="emerald"
          hint={<span className="font-bold text-emerald-600">Con carga individual</span>}
        />

        <DashboardStatCard
          title="Archivos asociados"
          value={associatedDocuments.length}
          icon={FolderOpen}
          variant="amber"
          hint={<span className="text-amber-600">Vinculados a casos</span>}
        />
      </div>

      {loading ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            Cargando soportes de garantia...
          </p>
        </section>
      ) : error ? (
        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
          <p className="text-sm text-rose-700">{error}</p>
        </section>
      ) : openCases.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">
            No hay casos abiertos para asociar soportes de garantia.
          </p>
        </section>
      ) : (
        <div className="space-y-4">
          {openCases.map((warrantyCase) => {
            const caseDocuments = associatedDocuments.filter(
              (document) =>
                getWarrantyCaseId(document) === warrantyCase.id &&
                document.status !== "VOID",
            );

            return (
              <ProjectDocumentMultiTypeSection
                key={warrantyCase.id}
                title={`Soportes del caso: ${warrantyCase.title}`}
                description={`Estado: ${
                  WARRANTY_CASE_STATUS_LABELS[warrantyCase.status]
                }. Las fotos y soportes cargados aqui quedan asociados solamente a este caso.`}
                items={WARRANTY_EVIDENCE_ITEMS}
                documents={caseDocuments}
                projectId={projectId}
                projectCode={projectCode}
                uploadMetadata={{warrantyCaseId: warrantyCase.id}}
                onRefresh={refresh}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function getWarrantyCaseId(document: ProjectDocumentEntity): string | null {
  const metadata = document.metadata;

  if (
    typeof metadata === "object" &&
    metadata !== null &&
    !Array.isArray(metadata) &&
    "warrantyCaseId" in metadata &&
    typeof metadata.warrantyCaseId === "string"
  ) {
    return metadata.warrantyCaseId;
  }

  return null;
}
