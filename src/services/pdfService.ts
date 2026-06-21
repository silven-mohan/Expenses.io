import { PDFDocument, rgb, PDFPage } from 'pdf-lib';
import type { MonthlyReport, Expense, LentRecord, BorrowedRecord } from '@/types';
import { formatCurrency, formatDate } from '@utils/dateUtils';

function drawText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  size: number = 12,
  color = rgb(0, 0, 0)
) {
  page.drawText(text, {
    x,
    y,
    size,
    color,
  });
}

function drawLine(page: PDFPage, x1: number, y1: number, x2: number, y2: number) {
  page.drawLine({
    start: { x: x1, y: y1 },
    end: { x: x2, y: y2 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
}

export async function generateMonthlyReportPDF(report: MonthlyReport, currency: string = 'INR'): Promise<ArrayBuffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { height } = page.getSize();

  let y = height - 50;
  const margin = 40;
  const pageWidth = 595 - 2 * margin;

  // Title
  drawText(
    page,
    `Monthly Report - ${report.month}/${report.year}`,
    margin,
    y,
    20,
    rgb(79, 70, 229)
  );
  y -= 30;

  // Summary Section
  drawText(page, 'Summary', margin, y, 14, rgb(0, 0, 0));
  y -= 20;

  drawLine(page, margin, y, margin + pageWidth, y);
  y -= 15;

  const summaryData = [
    `Total Expenses: ${formatCurrency(report.totalExpenses, currency)}`,
    `Total Lent: ${formatCurrency(report.totalLent, currency)}`,
    `Total Borrowed: ${formatCurrency(report.totalBorrowed, currency)}`,
    `Net Cash Flow: ${formatCurrency(report.netCashFlow, currency)}`,
  ];

  summaryData.forEach((text) => {
    drawText(page, text, margin + 10, y, 11);
    y -= 15;
  });

  y -= 15;

  // Expenses by Category
  if (report.expenses.length > 0) {
    drawText(page, 'Expenses by Category', margin, y, 14, rgb(0, 0, 0));
    y -= 20;

    drawLine(page, margin, y, margin + pageWidth, y);
    y -= 15;

    // Headers
    drawText(page, 'Category', margin + 10, y, 11, rgb(100, 100, 100));
    drawText(page, 'Amount', margin + 250, y, 11, rgb(100, 100, 100));
    drawText(page, 'Percentage', margin + 350, y, 11, rgb(100, 100, 100));
    y -= 15;

    // Data
    report.expenses.forEach((expense) => {
      const categoryText = expense.categoryName.substring(0, 20);
      const amountText = formatCurrency(expense.amount, currency);
      const percentageText = `${expense.percentage.toFixed(1)}%`;

