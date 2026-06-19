'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@stores/appStore';
import {
  getAllCategories,
  getAllExpenses,
  getAllLent,
  getAllBorrowed,
  getSettings,
} from '@services/index';
import { initializeDatabase } from '@db/index';

export function useInitializeApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setCategories, setExpenses, setLent, setBorrowed, setSettings } = useAppStore();

  useEffect(() => {
    async function initialize() {
      try {
        setIsLoading(true);
        await initializeDatabase();

        const [categories, expenses, lent, borrowed, settings] = await Promise.all([
          getAllCategories(),
          getAllExpenses(),
          getAllLent(),
          getAllBorrowed(),
          getSettings(),
        ]);

        setCategories(categories);
        setExpenses(expenses);
        setLent(lent);
        setBorrowed(borrowed);
        setSettings(settings);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to initialize app';
        setError(message);
        console.error('App initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initialize();
  }, [setCategories, setExpenses, setLent, setBorrowed, setSettings]);

  return { isLoading, error };
}
