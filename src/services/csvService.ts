import Papa from 'papaparse';
import type { Expense, LentRecord, BorrowedRecord, MonthlyReport } from '@/types';
import { formatDate } from '@utils/dateUtils';

export function generateExpensesCSV(
  expenses: Expense[],
  categoryMap: Record<string, string>,
  _currency: string = 'INR'
): string {
  const headers = ['Date', 'Category', 'Amount', 'Note'];
  const rows = expenses.map((expense) => [
    formatDate(expense.date, 'yyyy-MM-dd'),
    categoryMap[expense.categoryId] || 'Unknown',
    expense.amount.toString(),
    expense.note || '',
  ]);

  return Papa.unparse({
    fields: headers,
    data: rows,
  });
}

export function generateLentCSV(
  lent: LentRecord[],
  _currency: string = 'INR'
): string {
  const headers = ['Person', 'Amount', 'Paid', 'Remaining', 'Status', 'Date', 'Note'];
  const rows = lent.map((record) => [
    record.personName,
    record.amount.toString(),
    record.paidAmount.toString(),
    record.remainingAmount.toString(),
    record.status,
    formatDate(record.date, 'yyyy-MM-dd'),
    record.note || '',
  ]);

  return Papa.unparse({
    fields: headers,
    data: rows,
  });
}

export function generateBorrowedCSV(
  borrowed: BorrowedRecord[],
  _currency: string = 'INR'
): string {
  const headers = ['Person', 'Amount', 'Paid', 'Remaining', 'Status', 'Date', 'Note'];
  const rows = borrowed.map((record) => [
    record.personName,
    record.amount.toString(),
    record.paidAmount.toString(),
    record.remainingAmount.toString(),
    record.status,
    formatDate(record.date, 'yyyy-MM-dd'),
    record.note || '',
  ]);

  return Papa.unparse({
    fields: headers,
    data: rows,
  });
}

export function generateReportCSV(report: MonthlyReport, _currency: string = 'INR'): string {
  const headers = ['Category', 'Amount', 'Percentage'];
  const rows = report.expenses.map((exp) => [
    exp.categoryName,
    exp.amount.toString(),
    exp.percentage.toFixed(2),
  ]);

  // Add summary
  rows.push(['', '', '']);
  rows.push(['Total Expenses', report.totalExpenses.toString(), '100']);
  rows.push(['Total Lent', report.totalLent.toString(), '']);
  rows.push(['Total Borrowed', report.totalBorrowed.toString(), '']);
  rows.push(['Net Cash Flow', report.netCashFlow.toString(), '']);

  return Papa.unparse({
    fields: headers,
    data: rows,
  });
}

export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadPDF(pdf: Uint8Array, filename: string): void {
  const blob = new Blob([pdf.buffer as ArrayBuffer], { type: 'application/pdf' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
