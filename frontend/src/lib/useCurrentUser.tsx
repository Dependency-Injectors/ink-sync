import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  email: string;
}

interface CurrentUserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useCurrentUser = create<CurrentUserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "currentUser",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
