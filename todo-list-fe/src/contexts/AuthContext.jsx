import create from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      session: null,

      setSession: (session) => set({ session }),

      clearSession: () => set({ session: null }),
    }),
    {
      name: 'session',
      getStorage: () => localStorage,
    }
  )
);

export { useAuthStore };