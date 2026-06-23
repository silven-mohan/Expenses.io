import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export function formatCurrency(
  amount: number,
  symbol: string = '₹',
  decimals: number = 2
): string {
  return `${symbol}${amount.toFixed(decimals)}`;
}

export function formatDate(date: number | Date, formatStr: string = 'MMM dd, yyyy'): string {
  return format(new Date(date), formatStr);
}

export function formatDateShort(date: number | Date): string {
  return format(new Date(date), 'MMM dd');
}

export function formatMonth(date: number | Date): string {
  return format(new Date(date), 'MMMM yyyy');
}

export function getCurrentMonth(): { start: number; end: number } {
  const now = new Date();
  const start = startOfMonth(now).getTime();
  const end = endOfMonth(now).getTime();
  return { start, end };
}

export function getMonthRange(year: number, month: number): { start: number; end: number } {
  const date = new Date(year, month - 1, 1);
  const start = startOfMonth(date).getTime();
  const end = endOfMonth(date).getTime();
  return { start, end };
}

export function isDateInRange(date: number, start: number, end: number): boolean {
  return isWithinInterval(new Date(date), { start: new Date(start), end: new Date(end) });
}

export function getDateRange(days: number): { start: number; end: number } {
  const end = Date.now();
  const start = end - days * 24 * 60 * 60 * 1000;
  return { start, end };
}
