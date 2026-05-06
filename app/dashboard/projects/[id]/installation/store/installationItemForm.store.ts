"use client";

import {create} from "zustand";
import type {ProjectInstallationItemFormValues} from "@/app/core/projects/installation/schema";

type InstallationItemFormMode = "create" | "update";
type OnSavedCallback = (() => Promise<void> | void) | null;

type InstallationItemFormState = {
  open: boolean;
  mode: InstallationItemFormMode;
  itemId: string | null;
  projectId: string | null;
  installationId: string | null;
  isSaving: boolean;
  error: string | null;
  initialValues: Partial<ProjectInstallationItemFormValues>;
  onSaved: OnSavedCallback;
  openCreate: (
    projectId: string,
    installationId: string,
    initialValues?: Partial<ProjectInstallationItemFormValues>,
    onSaved?: OnSavedCallback,
  ) => void;
  openUpdate: (
    itemId: string,
    projectId: string,
    installationId: string,
    initialValues?: Partial<ProjectInstallationItemFormValues>,
    onSaved?: OnSavedCallback,
  ) => void;
  close: () => void;
  setSaving: (value: boolean) => void;
  setError: (message: string | null) => void;
};

export const useProjectInstallationItemFormStore =
  create<InstallationItemFormState>((set) => ({
    open: false,
    mode: "create",
    itemId: null,
    projectId: null,
    installationId: null,
    isSaving: false,
    error: null,
    initialValues: {},
    onSaved: null,
    openCreate: (projectId, installationId, initialValues, onSaved) =>
      set({
        open: true,
        mode: "create",
        itemId: null,
        projectId,
        installationId,
        isSaving: false,
        error: null,
        initialValues: initialValues ?? {},
        onSaved: onSaved ?? null,
      }),
    openUpdate: (itemId, projectId, installationId, initialValues, onSaved) =>
      set({
        open: true,
        mode: "update",
        itemId,
        projectId,
        installationId,
        isSaving: false,
        error: null,
        initialValues: initialValues ?? {},
        onSaved: onSaved ?? null,
      }),
    close: () =>
      set({
        open: false,
        mode: "create",
        itemId: null,
        projectId: null,
        installationId: null,
        isSaving: false,
        error: null,
        initialValues: {},
        onSaved: null,
      }),
    setSaving: (value) => set({isSaving: value}),
    setError: (message) => set({error: message}),
  }));
