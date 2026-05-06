"use client";

import {create} from "zustand";
import type {ProjectCreateValues} from "@/app/core/projects/schema/project.schema";

type ProjectCreateState = {
  open: boolean;
  quotationId: string | null;
  isSaving: boolean;
  error: string | null;
  initialValues: Partial<ProjectCreateValues>;

  openByQuotationId: (
    quotationId: string,
    initialValues?: Partial<ProjectCreateValues>,
  ) => void;

  close: () => void;

  setSaving: (v: boolean) => void;
  setError: (msg: string | null) => void;
};

export const useProjectUiStore = create<ProjectCreateState>((set) => ({
  open: false,
  quotationId: null,
  isSaving: false,
  error: null,
  initialValues: {},

  openByQuotationId: (quotationId, initialValues) =>
    set({
      open: true,
      quotationId,
      error: null,
      initialValues: initialValues ?? {},
    }),

  close: () =>
    set({
      open: false,
      quotationId: null,
      isSaving: false,
      error: null,
      initialValues: {},
    }),

  setSaving: (v) => set({isSaving: v}),
  setError: (msg) => set({error: msg}),
}));
