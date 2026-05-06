"use client";

import LoadingSection from "@/app/components/ui/LoadingSection";
import ErrorSection from "@/app/components/ui/ErrorSection";
import {useProjectDocuments} from "../hooks/useProjectDocuments";
import {ProjectDocumentsSummaryCards} from "./ProjectDocumentsSummaryCards";
import {ProjectDocumentsSections} from "./ProjectDocumentsSections";

type Props = {
  projectId: string;
  projectCode: string;
};

export default function ProjectDocuments({projectId, projectCode}: Props) {
  const {documents, loading, error, summary, refresh} =
    useProjectDocuments(projectId);

  if (loading) {
    return <LoadingSection message="Cargando documentos..." />;
  }

  if (error) {
    return <ErrorSection message={error} />;
  }

  return (
    <section className="space-y-6" data-purpose="project-documents-v2">
      <ProjectDocumentsSummaryCards summary={summary} />

      <ProjectDocumentsSections
        documents={documents}
        projectId={projectId}
        projectCode={projectCode}
        onRefresh={refresh}
      />
    </section>
  );
}
