import { db } from '@db/index';
import type { Expense } from '@types/index';
import { generateId } from '@utils/helpers';

export async function getAllExpenses(): Promise<Expense[]> {
  try {
    return await db.expenses.toArray();
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
    throw error;
  }
}

export async function getExpenseById(id: string): Promise<Expense | undefined> {
  try {
    return await db.expenses.get(id);
  } catch (error) {
    console.error('Failed to fetch expense:', error);
    throw error;
  }
}

export async function getExpensesByCategory(categoryId: string): Promise<Expense[]> {
  try {
    return await db.expenses.where('categoryId').equals(categoryId).toArray();
  } catch (error) {
    console.error('Failed to fetch expenses by category:', error);
    throw error;
  }
}

export async function getExpensesByDateRange(start: number, end: number): Promise<Expense[]> {
  try {
    return await db.expenses.where('date').between(start, end, true, true).toArray();
  } catch (error) {
    console.error('Failed to fetch expenses by date range:', error);
    throw error;
  }
}

export async function createExpense(
  categoryId: string,
  amount: number,
  date: number,
  note?: string
): Promise<Expense> {
  const expense: Expense = {
    id: generateId(),
    categoryId,
    amount,
    date,
    note,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  try {
    await db.expenses.add(expense);
    return expense;
  } catch (error) {
    console.error('Failed to create expense:', error);
    throw error;
  }
}

export async function updateExpense(
  id: string,
  updates: Partial<Omit<Expense, 'id' | 'createdAt'>>
): Promise<Expense | undefined> {
  try {
    const expense = await db.expenses.get(id);
    if (!expense) throw new Error('Expense not found');

    const updated: Expense = {
      ...expense,
      ...updates,
      updatedAt: Date.now(),
    };

    await db.expenses.put(updated);
    return updated;
  } catch (error) {
    console.error('Failed to update expense:', error);
    throw error;
  }
}

export async function deleteExpense(id: string): Promise<void> {
  try {
    await db.expenses.delete(id);
  } catch (error) {
    console.error('Failed to delete expense:', error);
    throw error;
  }
}
