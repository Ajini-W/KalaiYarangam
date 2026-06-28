import { create } from "zustand";

interface ProfileModalState {
  open: boolean;
  tab: "info" | "security" | "preferences";
  setOpen: (open: boolean) => void;
  setTab: (tab: "info" | "security" | "preferences") => void;
}

export const useProfileModal = create<ProfileModalState>((set) => ({
  open: false,
  tab: "info",
  setOpen: (open) => set({ open }),
  setTab: (tab) => set({ tab }),
}));
