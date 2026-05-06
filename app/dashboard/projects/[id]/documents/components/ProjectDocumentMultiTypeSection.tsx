"use client";

import {useMemo, useState} from "react";
import {Download, Eye, FolderOpen, Upload} from "lucide-react";
import {DocumentUploadDialog} from "./DocumentUploadDialog";
import {useProjectDocumentPreviewStore} from "../../../store/projectDocumentView.store";
import type {
  ProjectDocumentEntity,
  ProjectDocumentStatus,
  ProjectDocumentType,
} from "@/app/core/projects/documents/dto";
import {formatDate} from "@/app/utils/formatDate";

export type ProjectDocumentMultiTypeItem = {
  type: ProjectDocumentType;
  label: string;
  description?: string;
};

type Props = {
  title: string;
  description?: string;
  items: ProjectDocumentMultiTypeItem[];
  documents: ProjectDocumentEntity[];
  projectId: string;
  projectCode: string;
  onRefresh: () => void | Promise<void>;
};

export function ProjectDocumentMultiTypeSection({
  title,
  description,
  items,
  documents,
  projectId,
  projectCode,
  onRefresh,
}: Props) {
  const [activeItem, setActiveItem] = useState<ProjectDocumentMultiTypeItem | null>(
    null,
  );
  const openPreview = useProjectDocumentPreviewStore((state) => state.openPreview);

  const groupedDocuments = useMemo(() => {
    return items.map((item) => ({
      ...item,
      documents: documents
        .filter((document) => document.type === item.type && document.status !== "VOID")
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    }));
  }, [documents, items]);

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </h3>
          {description ? (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>

        <div className="space-y-4">
          {groupedDocuments.map((item) => (
            <div
              key={item.type}
              className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-semibold text-slate-900">
                      {item.label}
                    </h4>
                    <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      {item.documents.length} archivo
                      {item.documents.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  {item.description ? (
                    <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveItem(item)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                  <Upload className="h-4 w-4" />
                  Subir archivos
                </button>
              </div>

              {item.documents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
                  Aún no hay archivos cargados en esta categoría.
                </div>
              ) : (
                <div className="space-y-3">
                  {item.documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">
                            {document.title || document.fileName || item.label}
                          </span>
                          <StatusBadge status={document.status} />
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span>{document.fileName || "Archivo sin nombre"}</span>
                          <span>Subido: {formatDate(document.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {document.storageUrl ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                openPreview({
                                  title: document.title,
                                  url: document.storageUrl!,
                                  mimeType: document.mimeType,
                                })
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                              <Eye className="h-4 w-4" />
                              Ver
                            </button>

                            <a
                              href={document.storageUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                              <Download className="h-4 w-4" />
                              Descargar
                            </a>
                          </>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-400">
                            <FolderOpen className="h-4 w-4" />
                            Sin vista previa
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {activeItem ? (
        <DocumentUploadDialog
          open={Boolean(activeItem)}
          onClose={() => setActiveItem(null)}
          projectId={projectId}
          projectCode={projectCode}
          type={activeItem.type}
          label={activeItem.label}
          multiple
          onUploaded={() => {
            setActiveItem(null);
            onRefresh();
          }}
        />
      ) : null}
    </>
  );
}

function StatusBadge({status}: {status: ProjectDocumentStatus}) {
  const stylesByStatus: Record<ProjectDocumentStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    AVAILABLE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    REPLACED: "bg-slate-100 text-slate-600 border-slate-200",
    VOID: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const labelByStatus: Record<ProjectDocumentStatus, string> = {
    PENDING: "Pendiente",
    AVAILABLE: "Disponible",
    REPLACED: "Reemplazado",
    VOID: "Anulado",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${stylesByStatus[status]}`}>
      {labelByStatus[status]}
    </span>
  );
}
