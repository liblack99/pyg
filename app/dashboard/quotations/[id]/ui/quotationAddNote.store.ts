"use client";

import {create} from "zustand";

type QuotationAddNoteState = {
  open: boolean;
  id: string | null;
  isSaving: boolean;
  error: string | null;
  initialNote: string;

  openById: (id: string, initialNote?: string) => void;
  close: () => void;

  setSaving: (v: boolean) => void;
  setError: (msg: string | null) => void;
};

export const useQuotationAddNoteStore = create<QuotationAddNoteState>(
  (set) => ({
    open: false,
    id: null,
    isSaving: false,
    error: null,
    initialNote: "",

    openById: (id, initialNote) =>
      set({
        open: true,
        id,
        error: null,
        initialNote: initialNote ?? "",
      }),

    close: () =>
      set({
        open: false,
        id: null,
        isSaving: false,
        error: null,
        initialNote: "",
      }),

    setSaving: (v) => set({isSaving: v}),
    setError: (msg) => set({error: msg}),
  }),
);
