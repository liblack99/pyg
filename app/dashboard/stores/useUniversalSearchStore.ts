// app/stores/useUniversalSearchStore.ts
import {create} from "zustand";

type UniversalSearchModalTarget =
  | {type: "CLIENT"; id: string}
  | {type: "QUOTATION"; id: string}
  | null;

type UniversalSearchStore = {
  query: string;
  modalTarget: UniversalSearchModalTarget;

  setQuery: (query: string) => void;
  openClient: (id: string) => void;
  openQuotation: (id: string) => void;
  closeModal: () => void;
};

export const useUniversalSearchStore = create<UniversalSearchStore>((set) => ({
  query: "",
  modalTarget: null,

  setQuery: (query) => set({query}),

  openClient: (id) =>
    set({
      query: "",
      modalTarget: {type: "CLIENT", id},
    }),

  openQuotation: (id) =>
    set({
      query: "",
      modalTarget: {type: "QUOTATION", id},
    }),

  closeModal: () => set({modalTarget: null}),
}));
