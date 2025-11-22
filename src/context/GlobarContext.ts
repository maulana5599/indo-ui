// src/stores/productStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

// export const useProfileStore = create((set) => ({
//   profile: [],
//   setProfile: (data: any) => set({ profile: data }),
// }));

export const useProfileStore = create(
    persist((set) => ({
      profile: {},
      setProfile: (data: any) => set({ profile: data }),
      clearProfile : () => set({ profile: {} }),
    }),
    {
      name: "local-storage",
    }
  )
)

export const useRoleStore = create((set) => ({
  role: [],
  setRole: (data: any) => set({ role: data }),
}));
