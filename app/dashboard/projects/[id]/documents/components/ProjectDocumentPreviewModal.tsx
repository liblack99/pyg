"use client";

import Modal from "@/app/components/ui/Modal";
import {useProjectDocumentPreviewStore} from "../../../store/projectDocumentView.store";
import Image from "next/image";

export function ProjectDocumentPreviewModal() {
  const {open, title, url, mimeType, closePreview} =
    useProjectDocumentPreviewStore();

  if (!open || !url) return null;

  const isPdf = mimeType === "application/pdf";
  const isImage = mimeType?.startsWith("image/");

  return (
    <Modal open={open} title={title ?? "Vista previa"} onClose={closePreview}>
      <div className="h-[75vh] w-full">
        {isPdf ? (
          <iframe
            src={url}
            className="h-full w-full rounded-xl border border-slate-200"
          />
        ) : isImage ? (
          <Image
            src={url}
            alt={title ?? "Documento"}
            className="max-h-full w-full rounded-xl object-contain"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-sm text-slate-600">
            <p>No hay vista previa disponible para este tipo de archivo.</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-xl border border-slate-200 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50">
              Abrir documento
            </a>
          </div>
        )}
      </div>
    </Modal>
  );
}
