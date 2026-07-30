import { create } from 'zustand';

export type Role = 'citoyen' | 'admin' | 'agent';

interface AppState {
  role: Role;
  setRole: (role: Role) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  language: string;
  setLanguage: (lang: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  role: 'citoyen',
  setRole: (role) => set({ role }),
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