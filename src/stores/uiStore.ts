import { create } from 'zustand';

interface UIState {
  isAddModalOpen: boolean;
  isSettingsOpen: boolean;
  selectedDate: Date;
  filterCategory: string | null;
  searchQuery: string;

  // Actions
  setIsAddModalOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  setSelectedDate: (date: Date) => void;
  setFilterCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAddModalOpen: false,
  isSettingsOpen: false,
  selectedDate: new Date(),
  filterCategory: null,
  searchQuery: '',

  setIsAddModalOpen: (open: boolean) => set({ isAddModalOpen: open }),
  setIsSettingsOpen: (open: boolean) => set({ isSettingsOpen: open }),
  setSelectedDate: (date: Date) => set({ selectedDate: date }),
  setFilterCategory: (category: string | null) => set({ filterCategory: category }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
}));
