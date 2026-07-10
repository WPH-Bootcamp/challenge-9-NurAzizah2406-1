import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/auth";

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      setAuth: (token, user) => {
        // Simpan juga di localStorage agar axios interceptor bisa baca
        localStorage.setItem("auth-token", token);
        set({ token, user });
      },

      clearAuth: () => {
        localStorage.removeItem("auth-token");
        set({ token: null, user: null });
      },

      isAuthenticated: () => !!get().token,
    }),
    {
      name: "auth-storage", // key di localStorage
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
