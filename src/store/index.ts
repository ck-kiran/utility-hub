import { create } from 'zustand';

interface AppState {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  language: string;
  setLanguage: (language: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  language: 'en',
  setLanguage: (language) => set({ language }),
}));
