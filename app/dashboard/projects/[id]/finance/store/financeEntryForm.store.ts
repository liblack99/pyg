"use client";

import {create} from "zustand";
import type {ProjectDocumentEntity} from "@/app/core/projects/documents/dto";
import type {ProjectFinanceEntryFormValues} from "@/app/core/projects/finance/schema";

type FinanceEntryFormMode = "create" | "update";
type OnSavedCallback = (() => Promise<void> | void) | null;

type FinanceEntryFormState = {
  open: boolean;
  mode: FinanceEntryFormMode;
  entryId: string | null;
  projectId: string | null;
  isSaving: boolean;
  error: string | null;
  initialValues: Partial<ProjectFinanceEntryFormValues>;
  documents: ProjectDocumentEntity[];
  onSaved: OnSavedCallback;
  openCreate: (
    projectId: string,
    documents: ProjectDocumentEntity[],
    initialValues?: Partial<ProjectFinanceEntryFormValues>,
    onSaved?: OnSavedCallback,
  ) => void;
  openUpdate: (
    entryId: string,
    projectId: string,
    documents: ProjectDocumentEntity[],
    initialValues?: Partial<ProjectFinanceEntryFormValues>,
    onSaved?: OnSavedCallback,
  ) => void;
  close: () => void;
  setSaving: (value: boolean) => void;
  setError: (message: string | null) => void;
};

export const useProjectFinanceEntryFormStore = create<FinanceEntryFormState>(
  (set) => ({
    open: false,
    mode: "create",
    entryId: null,
    projectId: null,
    isSaving: false,
    error: null,
    initialValues: {},
    documents: [],
    onSaved: null,
    openCreate: (projectId, documents, initialValues, onSaved) =>
      set({
        open: true,
        mode: "create",
        entryId: null,
        projectId,
        isSaving: false,
        error: null,
        initialValues: initialValues ?? {},
        documents,
        onSaved: onSaved ?? null,
      }),
    openUpdate: (entryId, projectId, documents, initialValues, onSaved) =>
      set({
        open: true,
        mode: "update",
        entryId,
        projectId,
        isSaving: false,
        error: null,
        initialValues: initialValues ?? {},
        documents,
        onSaved: onSaved ?? null,
      }),
    close: () =>
      set({
        open: false,
        mode: "create",
        entryId: null,
        projectId: null,
        isSaving: false,
        error: null,
        initialValues: {},
        documents: [],
        onSaved: null,
      }),
    setSaving: (value) => set({isSaving: value}),
    setError: (message) => set({error: message}),
  }),
);
