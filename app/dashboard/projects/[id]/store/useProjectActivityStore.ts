// store/useProjectActivityStore.ts
import {create} from "zustand";

type ProjectActivityStore = {
  versions: Record<string, number>;
  notifyChanged: (projectId: string) => void;
};

export const useProjectActivityStore = create<ProjectActivityStore>((set) => ({
  versions: {},

  notifyChanged: (projectId) =>
    set((state) => ({
      versions: {
        ...state.versions,
        [projectId]: (state.versions[projectId] ?? 0) + 1,
      },
    })),
}));
