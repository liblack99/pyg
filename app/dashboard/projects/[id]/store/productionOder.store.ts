"use client";

import {create} from "zustand";
import type {ProductionOrderFormValues} from "@/app/core/projects/orderPdf/schema/production-order.schema";

type ProductionOrderState = {
  open: boolean;
  id: string | null;
  isSaving: boolean;
  error: string | null;
  initialValues: Partial<ProductionOrderFormValues>;

  openById: (id: string, initialValues?: ProductionOrderFormValues) => void;
  close: () => void;

  setSaving: (v: boolean) => void;
  setError: (msg: string | null) => void;
};

export const useProductionOrderStore = create<ProductionOrderState>((set) => ({
  open: false,
  id: null,
  isSaving: false,
  error: null,
  initialValues: {},

  openById: (id, initialValues) =>
    set({
      open: true,
      id,
      error: null,
      initialValues: initialValues ?? {},
    }),

  close: () =>
    set({
      open: false,
      id: null,
      isSaving: false,
      error: null,
      initialValues: {},
    }),

  setSaving: (v) => set({isSaving: v}),
  setError: (msg) => set({error: msg}),
}));
