import { create } from 'zustand';
import type {
  Category,
  Expense,
  LentRecord,
  BorrowedRecord,
  Settings,
} from '@types/index';

interface AppState {
  categories: Category[];
  expenses: Expense[];
  lent: LentRecord[];
  borrowed: BorrowedRecord[];
  settings: Settings | null;
  loading: boolean;
  error: string | null;

  // Actions
  setCategories: (categories: Category[]) => void;
  setExpenses: (expenses: Expense[]) => void;
  setLent: (lent: LentRecord[]) => void;
  setBorrowed: (borrowed: BorrowedRecord[]) => void;
  setSettings: (settings: Settings | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  categories: [],
  expenses: [],
  lent: [],
  borrowed: [],
  settings: null,
  loading: false,
  error: null,

  setCategories: (categories: Category[]) => set({ categories }),
  setExpenses: (expenses: Expense[]) => set({ expenses }),
  setLent: (lent: LentRecord[]) => set({ lent }),
  setBorrowed: (borrowed: BorrowedRecord[]) => set({ borrowed }),
  setSettings: (settings: Settings | null) => set({ settings }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  reset: () =>
    set({
      categories: [],
      expenses: [],
      lent: [],
      borrowed: [],
      settings: null,
      loading: false,
      error: null,
    }),
}));
