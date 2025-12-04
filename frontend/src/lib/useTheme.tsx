import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type theme = "light" | "dark";

interface ThemeState {
  theme: theme;
  setTheme: () => void;
}

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      setTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
    }),
    {
      name: "theme",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
