'use client';

import { useCallback } from 'react';
import { useAppStore } from '@stores/appStore';
import {
  getAllExpenses,
  getExpensesByDateRange,
  createExpense as createExpenseService,
  updateExpense as updateExpenseService,
  deleteExpense as deleteExpenseService,
} from '@services/expenseService';

export function useExpenses() {
  const { expenses, setExpenses } = useAppStore();

  const refreshExpenses = useCallback(async () => {
    try {
      const data = await getAllExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to refresh expenses:', error);
    }
  }, [setExpenses]);

  const createExpense = useCallback(
    async (categoryId: string, amount: number, date: number, note?: string) => {
      try {
        const expense = await createExpenseService(categoryId, amount, date, note);
        await refreshExpenses();
        return expense;
      } catch (error) {
        console.error('Failed to create expense:', error);
        throw error;
      }
    },
    [refreshExpenses]
  );

  const updateExpense = useCallback(
    async (id: string, updates: any) => {
      try {
        await updateExpenseService(id, updates);
        await refreshExpenses();
      } catch (error) {
        console.error('Failed to update expense:', error);
        throw error;
      }
    },
    [refreshExpenses]
  );

  const deleteExpense = useCallback(
    async (id: string) => {
      try {
        await deleteExpenseService(id);
        await refreshExpenses();
      } catch (error) {
        console.error('Failed to delete expense:', error);
        throw error;
      }
    },
    [refreshExpenses]
  );

  const getExpensesInRange = useCallback(
    async (start: number, end: number) => {
      try {
        return await getExpensesByDateRange(start, end);
      } catch (error) {
        console.error('Failed to get expenses in range:', error);
        return [];
      }
    },
    []
  );

  return {
    expenses,
    createExpense,
    updateExpense,
    deleteExpense,
    refreshExpenses,
    getExpensesInRange,
  };
}
