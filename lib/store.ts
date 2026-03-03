import { create } from "zustand";

type AuthState = {
  role?: "USER" | "COUNSELLOR" | "ADMIN";
  setRole: (role: AuthState["role"]) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  role: undefined,
  setRole: (role) => set({ role })
}));
