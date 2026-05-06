"use client";

import {useState} from "react";
import {Eye, Download, Upload, FileCog} from "lucide-react";
import {DocumentUploadDialog} from "./DocumentUploadDialog";
import {useProjectDocumentPreviewStore} from "../../../store/projectDocumentView.store";
import {apiPost} from "@/app/lib/api.client";
import type {
  ProjectDocumentEntity,
  ProjectDocumentStatus,
  ProjectDocumentType,
} from "@/app/core/projects/documents/dto";

type DocumentRowCardProps = {
  projectId: string;
  projectCode: string;
  type: ProjectDocumentType;
  label: string;
  mode: "UPLOAD" | "GENERATE" | "MIXED";
  document: ProjectDocumentEntity | null;
  onRefresh: () => void | Promise<void>;
};

export function DocumentRowCard({
  projectId,
  projectCode,
  type,
  label,
  mode,
  document,
  onRefresh,
}: DocumentRowCardProps) {
  const [openUpload, setOpenUpload] = useState(false);
  const [loadingGenerate, setLoadingGenerate] = useState(false);

  const openPreview = useProjectDocumentPreviewStore((s) => s.openPreview);

  const visualStatus: ProjectDocumentStatus = document?.status ?? "PENDING";

  async function handleGenerate() {
    try {
      setLoadingGenerate(true);
      await apiPost(`/api/projects/${projectId}/documents/generate`, {type});
      onRefresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingGenerate(false);
    }
  }

  const previewUrl = document?.storageUrl;

  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">{label}</div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={visualStatus} />
            <TypeHint mode={mode} />
          </div>

          {document?.fileName && (
            <p className="pl-1 mt-2 truncate text-xs text-slate-600">
              {document.fileName}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {mode !== "GENERATE" && visualStatus !== "AVAILABLE" && (
            <button
              type="button"
              onClick={() => setOpenUpload(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              <Upload className="h-4 w-4" />
              Subir archivo
            </button>
          )}

          {mode !== "UPLOAD" && visualStatus !== "AVAILABLE" && (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loadingGenerate}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60">
              <FileCog className="h-4 w-4" />
              {loadingGenerate ? "Generando..." : "Generar"}
            </button>
          )}

          {visualStatus === "AVAILABLE" && previewUrl && (
            <>
              <button
                type="button"
                onClick={() =>
                  openPreview({
                    title: document.title,
                    url: previewUrl,
                    mimeType: document.mimeType,
                  })
                }
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                <Eye className="h-4 w-4" />
                Ver
              </button>

              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                <Download className="h-4 w-4" />
                Descargar
              </a>
            </>
          )}
        </div>
      </div>

      <DocumentUploadDialog
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        projectId={projectId}
        projectCode={projectCode}
        type={type}
        label={label}
        onUploaded={() => {
          setOpenUpload(false);
          onRefresh();
        }}
      />
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

function TypeHint({mode}: {mode: "UPLOAD" | "GENERATE" | "MIXED"}) {
  const label =
    mode === "UPLOAD"
      ? "Documento subido"
      : mode === "GENERATE"
        ? "Documento generado"
        : "Documento mixto";

  return <span className=" text-xs text-slate-600">{label}</span>;
}
