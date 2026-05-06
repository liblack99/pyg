"use client";

import {DOCUMENT_GROUPS} from "../constants/document-groups";
import type {ProjectDocumentEntity} from "@/app/core/projects/documents/dto";
import {ProjectDocumentSection} from "./ProjectDocumentSection";

type Props = {
  documents: ProjectDocumentEntity[];
  projectId: string;
  projectCode: string;
  onRefresh: () => void | Promise<void>;
};

export function ProjectDocumentsSections({
  documents,
  projectId,
  projectCode,
  onRefresh,
}: Props) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Gestion documental
        </h2>
      </div>

      <div className="space-y-6 p-6">
        {DOCUMENT_GROUPS.map((group) => (
          <ProjectDocumentSection
            key={group.key}
            title={group.title}
            items={group.items}
            documents={documents}
            projectId={projectId}
            projectCode={projectCode}
            onRefresh={onRefresh}
          />
        ))}
      </div>
    </section>
  );
}
