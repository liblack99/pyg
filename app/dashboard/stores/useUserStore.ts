// @/app/dashboard/store/useUserStore.ts
import {create} from "zustand";
import type {Me} from "@/app/lib/auth.types";

interface UserState {
  user: Me | null;
  setUser: (user: Me) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({user}),
}));
