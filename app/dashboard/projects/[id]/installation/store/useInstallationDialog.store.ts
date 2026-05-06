"use client";

import {create} from "zustand";
import type {ProjectInstallationDetail} from "@/app/core/projects/installation/dto";

type InstallationDialogState = {
  open: boolean;
  installation: ProjectInstallationDetail | null;
  openEdit: (installation: ProjectInstallationDetail) => void;
  close: () => void;
};

export const useInstallationDialogStore = create<InstallationDialogState>(
  (set) => ({
    open: false,
    installation: null,
    openEdit: (installation) =>
      set({
        open: true,
        installation,
      }),
    close: () =>
      set({
        open: false,
        installation: null,
      }),
  }),
);
