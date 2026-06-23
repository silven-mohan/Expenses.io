'use client';

import { useCallback } from 'react';
import { useAppStore } from '@stores/appStore';
import {
  getAllLent,
  createLent as createLentService,
  updateLent as updateLentService,
  settleLent as settleLentService,
  deleteLent as deleteLentService,
} from '@services/lentService';
import type { LentRecord } from '@/types';

export function useLent() {
  const { lent, setLent } = useAppStore();

  const refreshLent = useCallback(async () => {
    try {
      const data = await getAllLent();
      setLent(data);
    } catch (error) {
      console.error('Failed to refresh lent:', error);
    }
  }, [setLent]);

  const createLent = useCallback(
    async (personName: string, amount: number, date: number, note?: string) => {
      try {
        const record = await createLentService(personName, amount, date, note);
        await refreshLent();
        return record;
      } catch (error) {
        console.error('Failed to create lent record:', error);
        throw error;
      }
    },
    [refreshLent]
  );

  const updateLent = useCallback(
    async (id: string, updates: Partial<LentRecord>) => {
      try {
        await updateLentService(id, updates);
        await refreshLent();
      } catch (error) {
        console.error('Failed to update lent record:', error);
        throw error;
      }
    },
    [refreshLent]
  );

  const settleLent = useCallback(
    async (id: string, amount: number) => {
      try {
        await settleLentService(id, amount);
        await refreshLent();
      } catch (error) {
        console.error('Failed to settle lent:', error);
        throw error;
      }
    },
    [refreshLent]
  );

  const deleteLent = useCallback(
    async (id: string) => {
      try {
        await deleteLentService(id);
        await refreshLent();
      } catch (error) {
        console.error('Failed to delete lent record:', error);
        throw error;
      }
    },
    [refreshLent]
  );

  return {
    lent,
    createLent,
    updateLent,
    settleLent,
    deleteLent,
    refreshLent,
  };
}
