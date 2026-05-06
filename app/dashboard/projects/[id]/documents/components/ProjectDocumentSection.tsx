"use client";

import {DocumentRowCard} from "./DocumentRowCard";
import type {
  ProjectDocumentEntity,
  ProjectDocumentType,
} from "@/app/core/projects/documents/dto";

type Item = {
  type: ProjectDocumentType;
  label: string;
  mode: "UPLOAD" | "GENERATE" | "MIXED";
};

type ProjectDocumentSectionProps = {
  title: string;
  items: Item[];
  documents: ProjectDocumentEntity[];
  projectId: string;
  projectCode: string;
  onRefresh: () => void | Promise<void>;
};

export function ProjectDocumentSection({
  title,
  items,
  documents,
  projectId,
  projectCode,
  onRefresh,
}: ProjectDocumentSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          {title}
        </h3>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const doc =
            documents.find(
              (document) =>
                document.type === item.type && document.status !== "VOID",
            ) ?? null;

          return (
            <DocumentRowCard
              key={item.type}
              projectId={projectId}
              projectCode={projectCode}
              type={item.type}
              label={item.label}
              mode={item.mode}
              document={doc}
              onRefresh={onRefresh}
            />
          );
        })}
      </div>
    </div>
  );
}
