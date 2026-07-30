import { create } from 'zustand';
import { User } from './types';

export type Role = 'CITOYEN' | 'ADMIN' | 'AGENT';

interface AppState {
  role: Role;
  setRole: (role: Role) => void;
  user: User | null;
  setUser: (user: User) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  language: string;
  setLanguage: (lang: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  role: 'CITOYEN',
  setRole: (role) => set({ role }),
  user: null,
  setUser: (user) => set({ user }),
  darkMode: false,
  setDarkMode: (dark) => {
    set({ darkMode: dark });
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  language: 'fr',
  setLanguage: (lang) => set({ language: lang }),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));