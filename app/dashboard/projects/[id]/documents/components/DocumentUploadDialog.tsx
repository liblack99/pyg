"use client";

import {useRef, useState} from "react";
import {Paperclip, X} from "lucide-react";
import type {ProjectDocumentType} from "@/app/core/projects/documents/dto";

type UploadMetadata = Record<string, string | number | boolean | null>;

type DocumentUploadDialogProps = {
  open: boolean;
  onClose: () => void;
  projectId: string;
  projectCode: string;
  type: ProjectDocumentType;
  label: string;
  onUploaded: () => void;
  multiple?: boolean;
  metadata?: UploadMetadata;
};

export function DocumentUploadDialog({
  open,
  onClose,
  projectId,
  projectCode,
  type,
  label,
  onUploaded,
  multiple = false,
  metadata,
}: DocumentUploadDialogProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  function handleClose() {
    if (loading) return;
    setFiles([]);
    onClose();
  }

  async function handleSubmit() {
    if (files.length === 0) return;

    try {
      setLoading(true);

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        formData.append("title", file.name);
        formData.append("projectCode", projectCode);
        if (metadata) {
          formData.append("metadata", JSON.stringify(metadata));
        }

        const res = await fetch(`/api/projects/${projectId}/documents/upload`, {
          method: "POST",
          body: formData,
        });

        const data: {error?: string} = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "No se pudo subir el documento");
        }
      }

      setFiles([]);
      onUploaded();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const selectedLabel =
    files.length === 0
      ? multiple
        ? "Seleccionar archivos"
        : "Seleccionar archivo"
      : files.length === 1
        ? files[0].name
        : `${files.length} archivos seleccionados`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Subir documento
            </h2>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Archivo
            </label>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
              className="flex w-full items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-left transition hover:border-blue-400 hover:bg-blue-50/30 disabled:cursor-not-allowed disabled:opacity-60">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-2 shadow-sm">
                  <Paperclip className="h-4 w-4 text-slate-500" />
                </div>

                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-slate-800">
                    {selectedLabel}
                  </div>
                  <div className="text-xs text-slate-500">
                    {multiple
                      ? "PDF, imagen o documentos relacionados"
                      : "PDF, imagen o documento relacionado"}
                  </div>
                </div>
              </div>

              <span className="text-sm font-medium text-blue-600">
                Examinar
              </span>
            </button>

            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              multiple={multiple}
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
            />
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
            {multiple
              ? "Sube uno o varios archivos para dejarlos asociados a esta categoría documental del proyecto."
              : "Sube la versión oficial de este documento para dejarla asociada al proyecto."}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={files.length === 0 || loading}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {loading
              ? multiple
                ? "Subiendo archivos..."
                : "Subiendo..."
              : multiple
                ? "Guardar archivos"
                : "Guardar documento"}
          </button>
        </div>
      </div>
    </div>
  );
}
