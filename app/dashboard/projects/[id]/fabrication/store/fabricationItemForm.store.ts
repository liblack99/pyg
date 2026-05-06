"use client";

import {create} from "zustand";
import type {ProjectFabricationItemFormValues} from "@/app/core/projects/fabrication/schema";

type FabricationItemFormMode = "create" | "update";

type OnSavedCallback = (() => Promise<void> | void) | null;

type FabricationItemFormState = {
  open: boolean;
  mode: FabricationItemFormMode;
  itemId: string | null;
  projectId: string | null;
  fabricationId: string | null;
  isSaving: boolean;
  error: string | null;
  initialValues: Partial<ProjectFabricationItemFormValues>;
  onSaved: OnSavedCallback;

  openCreate: (
    projectId: string,
    fabricationId: string,
    initialValues?: Partial<ProjectFabricationItemFormValues>,
    onSaved?: OnSavedCallback,
  ) => void;

  openUpdate: (
    itemId: string,
    projectId: string,
    fabricationId: string,
    initialValues?: Partial<ProjectFabricationItemFormValues>,
    onSaved?: OnSavedCallback,
  ) => void;

  close: () => void;
  setSaving: (v: boolean) => void;
  setError: (msg: string | null) => void;
};

export const useProjectFabricationItemFormStore =
  create<FabricationItemFormState>((set) => ({
    open: false,
    mode: "create",
    itemId: null,
    projectId: null,
    fabricationId: null,
    isSaving: false,
    error: null,
    initialValues: {},
    onSaved: null,

    openCreate: (projectId, fabricationId, initialValues, onSaved) =>
      set({
        open: true,
        mode: "create",
        itemId: null,
        projectId,
        fabricationId,
        isSaving: false,
        error: null,
        initialValues: initialValues ?? {},
        onSaved: onSaved ?? null,
      }),

    openUpdate: (itemId, projectId, fabricationId, initialValues, onSaved) =>
      set({
        open: true,
        mode: "update",
        itemId,
        projectId,
        fabricationId,
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
        fabricationId: null,
        isSaving: false,
        error: null,
        initialValues: {},
        onSaved: null,
      }),

    setSaving: (v) => set({isSaving: v}),
    setError: (msg) => set({error: msg}),
  }));
