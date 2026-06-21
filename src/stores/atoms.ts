import { atom } from 'jotai';
import type {
  Category,
  Expense,
  LentRecord,
  BorrowedRecord,
  Settings,
} from '@/types';

export const categoriesAtom = atom<Category[]>([]);
export const expensesAtom = atom<Expense[]>([]);
export const lentAtom = atom<LentRecord[]>([]);
export const borrowedAtom = atom<BorrowedRecord[]>([]);
export const settingsAtom = atom<Settings | null>(null);
export const loadingAtom = atom<boolean>(false);
