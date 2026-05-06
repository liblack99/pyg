"use client";

import {create} from "zustand";

type ProjectDocumentPreviewState = {
  open: boolean;
  title: string | null;
  url: string | null;
  mimeType: string | null;

  openPreview: (params: {
    title?: string | null;
    url: string;
    mimeType?: string | null;
  }) => void;

  closePreview: () => void;
};

export const useProjectDocumentPreviewStore =
  create<ProjectDocumentPreviewState>((set) => ({
    open: false,
    title: null,
    url: null,
    mimeType: null,

    openPreview: ({title, url, mimeType}) =>
      set({
        open: true,
        title: title ?? "Vista previa del documento",
        url,
        mimeType: mimeType ?? null,
      }),

    closePreview: () =>
      set({
        open: false,
        title: null,
        url: null,
        mimeType: null,
      }),
  }));
