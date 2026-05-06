"use client";

import {create} from "zustand";
import type {
  ProjectCreateValues,
  ProjectUpdateValues,
} from "@/app/core/projects/schema/project.schema";

type ProjectFormMode = "create" | "update";

type ProjectFormState = {
  open: boolean;
  mode: ProjectFormMode;
  projectId: string | null;
  quotationId: string | null;
  isSaving: boolean;
  error: string | null;
  initialValues: Partial<ProjectCreateValues>;

  openCreate: (
    quotationId: string,
    initialValues?: Partial<ProjectCreateValues>,
  ) => void;

  openUpdate: (
    projectId: string,
    initialValues?: Partial<ProjectUpdateValues>,
  ) => void;

  close: () => void;

  setSaving: (v: boolean) => void;
  setError: (msg: string | null) => void;
};

export const useProjectFormStore = create<ProjectFormState>((set) => ({
  open: false,
  mode: "create",
  projectId: null,
  quotationId: null,
  isSaving: false,
  error: null,
  initialValues: {},

  openCreate: (quotationId, initialValues) =>
    set({
      open: true,
      mode: "create",
      projectId: null,
      quotationId,
      error: null,
      initialValues: initialValues ?? {},
    }),

  openUpdate: (projectId, initialValues) =>
    set({
      open: true,
      mode: "update",
      projectId,
      quotationId: null,
      error: null,
      initialValues: initialValues ?? {},
    }),

  close: () =>
    set({
      open: false,
      mode: "create",
      projectId: null,
      quotationId: null,
      isSaving: false,
      error: null,
      initialValues: {},
    }),

  setSaving: (v) => set({isSaving: v}),
  setError: (msg) => set({error: msg}),
}));
