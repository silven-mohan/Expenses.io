'use client';

import { useCallback } from 'react';
import { useAppStore } from '@stores/appStore';
import {
  getAllBorrowed,
  createBorrowed as createBorrowedService,
  updateBorrowed as updateBorrowedService,
  settleBorrowed as settleBorrowedService,
  deleteBorrowed as deleteBorrowedService,
} from '@services/borrowedService';
import type { BorrowedRecord } from '@/types';

export function useBorrowed() {
  const { borrowed, setBorrowed } = useAppStore();

  const refreshBorrowed = useCallback(async () => {
    try {
      const data = await getAllBorrowed();
      setBorrowed(data);
    } catch (error) {
      console.error('Failed to refresh borrowed:', error);
    }
  }, [setBorrowed]);

  const createBorrowed = useCallback(
    async (personName: string, amount: number, date: number, note?: string) => {
      try {
        const record = await createBorrowedService(personName, amount, date, note);
        await refreshBorrowed();
        return record;
      } catch (error) {
        console.error('Failed to create borrowed record:', error);
        throw error;
      }
    },
    [refreshBorrowed]
  );

  const updateBorrowed = useCallback(
    async (id: string, updates: Partial<BorrowedRecord>) => {
      try {
        await updateBorrowedService(id, updates);
        await refreshBorrowed();
      } catch (error) {
        console.error('Failed to update borrowed record:', error);
        throw error;
      }
    },
    [refreshBorrowed]
  );

  const settleBorrowed = useCallback(
    async (id: string, amount: number) => {
      try {
        await settleBorrowedService(id, amount);
        await refreshBorrowed();
      } catch (error) {
        console.error('Failed to settle borrowed:', error);
        throw error;
      }
    },
    [refreshBorrowed]
  );

  const deleteBorrowed = useCallback(
    async (id: string) => {
      try {
        await deleteBorrowedService(id);
        await refreshBorrowed();
      } catch (error) {
        console.error('Failed to delete borrowed record:', error);
        throw error;
      }
    },
    [refreshBorrowed]
  );

  return {
    borrowed,
    createBorrowed,
    updateBorrowed,
    settleBorrowed,
    deleteBorrowed,
    refreshBorrowed,
  };
}
