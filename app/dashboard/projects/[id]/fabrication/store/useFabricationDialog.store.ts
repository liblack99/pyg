"use client";

import {create} from "zustand";
import type {ProjectFabricationDetail} from "@/app/core/projects/fabrication/dto";

type FabricationDialogState = {
  open: boolean;
  fabrication: ProjectFabricationDetail | null;

  openEdit: (fabrication: ProjectFabricationDetail) => void;
  close: () => void;
};

export const useFabricationDialogStore = create<FabricationDialogState>(
  (set) => ({
    open: false,
    fabrication: null,

    openEdit: (fabrication) =>
      set({
        open: true,
        fabrication,
      }),

    close: () =>
      set({
        open: false,
        fabrication: null,
      }),
  }),
);
