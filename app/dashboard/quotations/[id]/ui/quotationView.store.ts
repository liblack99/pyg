"use client";

import {create} from "zustand";
import type {Quotation} from "@/app/core/quotations/dto";

type QuotationViewState = {
  open: boolean;
  id: string | null;
  isLoading: boolean;
  error: string | null;
  data: Quotation | null;

  openById: (id: string) => void;
  close: () => void;

  setLoading: (v: boolean) => void;
  setError: (msg: string | null) => void;
  setData: (q: Quotation | null) => void;
  setId: (id: string | null) => void;
};

export const useQuotationViewStore = create<QuotationViewState>((set) => ({
  open: false,
  id: null,
  isLoading: false,
  error: null,
  data: null,

  openById: (id) =>
    set({
      open: true,
      id,
      error: null,
    }),

  close: () =>
    set({
      open: false,
      id: null,
      isLoading: false,
      error: null,
      data: null,
    }),

  setLoading: (v) => set({isLoading: v}),
  setError: (msg) => set({error: msg}),
  setData: (q) => set({data: q}),
  setId: (id) => set({id}),
}));
