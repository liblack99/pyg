"use client";

import {create} from "zustand";

type ProductionOrderViewState = {
  listOpen: boolean;
  detailOpen: boolean;
  projectId: string | null;
  selectedId: string | null;
  openList: (projectId: string) => void;
  closeList: () => void;
  openDetail: (productionOrderId: string) => void;
  closeDetail: () => void;
};

export const useProductionOrderViewStore =
  create<ProductionOrderViewState>((set) => ({
    listOpen: false,
    detailOpen: false,
    projectId: null,
    selectedId: null,

    openList: (projectId) =>
      set({
        listOpen: true,
        detailOpen: false,
        projectId,
        selectedId: null,
      }),

    closeList: () =>
      set({
        listOpen: false,
        detailOpen: false,
        selectedId: null,
      }),

    openDetail: (productionOrderId) =>
      set({
        detailOpen: true,
        selectedId: productionOrderId,
      }),

    closeDetail: () =>
      set({
        detailOpen: false,
        selectedId: null,
      }),
  }));
