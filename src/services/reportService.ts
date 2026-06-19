import { db } from '@db/index';
import type {
  Category,
  Expense,
  LentRecord,
  BorrowedRecord,
  Settlement,
  Settings,
  MonthlyReport,
} from '@types/index';
import { getMonthRange, isDateInRange } from '@utils/dateUtils';
import { groupBy, sumBy, sortBy } from '@utils/helpers';

export async function generateMonthlyReport(
  year: number,
  month: number
): Promise<MonthlyReport> {
  try {
    const { start, end } = getMonthRange(year, month);

    const expenses = await db.expenses.toArray();
    const lent = await db.lent.toArray();
    const borrowed = await db.borrowed.toArray();
    const categories = await db.categories.toArray();

    const monthExpenses = expenses.filter((e) => isDateInRange(e.date, start, end));
    const monthLent = lent.filter((l) => isDateInRange(l.date, start, end));
    const monthBorrowed = borrowed.filter((b) => isDateInRange(b.date, start, end));

    const expensesByCategory = groupBy(monthExpenses, (e) => e.categoryId);
    const categoryBreakdown = Object.entries(expensesByCategory).map(([categoryId, items]) => {
      const category = categories.find((c) => c.id === categoryId);
      const amount = sumBy(items, (e) => e.amount);
      return {
        categoryId,
        categoryName: category?.name || 'Unknown',
        amount,
        percentage: 0,
      };
    });

    const totalExpenses = sumBy(monthExpenses, (e) => e.amount);
    const totalLent = sumBy(monthLent, (l) => l.amount);
    const totalBorrowed = sumBy(monthBorrowed, (b) => b.amount);
    const netCashFlow = totalExpenses + totalLent - totalBorrowed;

    const categoryBreakdownWithPercentage = categoryBreakdown.map((c) => ({
      ...c,
      percentage: totalExpenses > 0 ? (c.amount / totalExpenses) * 100 : 0,
    }));

    return {
      month,
      year,
      expenses: sortBy(categoryBreakdownWithPercentage, (c) => c.amount, false),
      totalExpenses,
      totalLent,
      totalBorrowed,
      netCashFlow,
      generatedAt: Date.now(),
    };
  } catch (error) {
    console.error('Failed to generate monthly report:', error);
    throw error;
  }
}

export async function getAnalyticsSummary() {
  try {
    const expenses = await db.expenses.toArray();
    const lent = await db.lent.toArray();
    const borrowed = await db.borrowed.toArray();
    const categories = await db.categories.toArray();

    const totalExpenses = sumBy(expenses, (e) => e.amount);
    const totalLent = sumBy(lent, (l) => l.amount);
    const totalBorrowed = sumBy(borrowed, (b) => b.amount);
    const pendingLent = sumBy(
      lent.filter((l) => l.status !== 'settled'),
      (l) => l.remainingAmount
    );
    const pendingBorrowed = sumBy(
      borrowed.filter((b) => b.status !== 'settled'),
      (b) => b.remainingAmount
    );

    const categoryTotals = groupBy(expenses, (e) => e.categoryId);
    const topCategories = Object.entries(categoryTotals)
      .map(([categoryId, items]) => {
        const category = categories.find((c) => c.id === categoryId);
        return {
          categoryId,
          categoryName: category?.name || 'Unknown',
          amount: sumBy(items, (e) => e.amount),
          count: items.length,
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      totalExpenses,
      totalLent,
      totalBorrowed,
      pendingLent,
      pendingBorrowed,
      totalTransactions: expenses.length + lent.length + borrowed.length,
      topCategories,
    };
  } catch (error) {
    console.error('Failed to get analytics summary:', error);
    throw error;
  }
}
