'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@stores/appStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@components/ui';
import { generateMonthlyReport } from '@services/reportService';
import { generateReportCSV, downloadCSV, downloadPDF } from '@services/csvService';
import { generateMonthlyReportPDF } from '@services/pdfService';
import { Download, FileJson } from 'lucide-react';
import { formatCurrency } from '@utils/dateUtils';
import type { MonthlyReport } from '@/types';

export default function ReportsPage() {
  const { settings } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [_loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return { month: now.getMonth() + 1, year: now.getFullYear() };
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadReport();
    }
  }, [currentDate, mounted]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const monthlyReport = await generateMonthlyReport(currentDate.year, currentDate.month);
      setReport(monthlyReport);
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !report) return null;

  const currencySymbol = settings?.currencySymbol || '₹';

  const handleDownloadCSV = () => {
    const csv = generateReportCSV(report, currencySymbol);
    downloadCSV(csv, `expense-report-${currentDate.year}-${currentDate.month}.csv`);
  };

  const handleDownloadPDF = async () => {
    try {
      const pdf = await generateMonthlyReportPDF(report, currencySymbol);
      downloadPDF(pdf, `expense-report-${currentDate.year}-${currentDate.month}.pdf`);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  };

  const previousMonth = () => {
    setCurrentDate((prev) => {
      if (prev.month === 1) {
        return { month: 12, year: prev.year - 1 };
      }
      return { ...prev, month: prev.month - 1 };
    });
  };

  const nextMonth = () => {
    setCurrentDate((prev) => {
      if (prev.month === 12) {
        return { month: 1, year: prev.year + 1 };
      }
      return { ...prev, month: prev.month + 1 };
    });
  };

  const monthName = new Date(currentDate.year, currentDate.month - 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="container-max py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted mt-1">Generate and export your financial reports</p>
      </div>

      {/* Month Navigation */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{monthName} Report</CardTitle>
            <CardDescription>Monthly expense summary and breakdown</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={previousMonth}>
              ← Previous
            </Button>
            <Button variant="outline" onClick={nextMonth}>
              Next →
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted mb-2">Total Expenses</p>
            <p className="text-2xl font-bold">{formatCurrency(report.totalExpenses, currencySymbol)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted mb-2">Total Lent</p>
            <p className="text-2xl font-bold">{formatCurrency(report.totalLent, currencySymbol)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted mb-2">Total Borrowed</p>
            <p className="text-2xl font-bold">{formatCurrency(report.totalBorrowed, currencySymbol)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted mb-2">Net Cash Flow</p>
            <p className="text-2xl font-bold">{formatCurrency(report.netCashFlow, currencySymbol)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Expenses Breakdown */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {report.expenses.length === 0 ? (
              <p className="text-muted text-center py-8">No expenses this month</p>
            ) : (
              report.expenses.map((exp) => (
                <div key={exp.categoryId} className="flex items-center justify-between p-3 rounded-lg bg-primary-50 dark:bg-primary-900">
                  <div>
                    <p className="font-medium">{exp.categoryName}</p>
                    <p className="text-sm text-muted">{exp.percentage.toFixed(1)}% of total</p>
                  </div>
                  <p className="text-lg font-bold">{formatCurrency(exp.amount, currencySymbol)}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Download Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleDownloadCSV} className="flex items-center gap-2">
              <Download size={18} />
              Download CSV
            </Button>
            <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
              <Download size={18} />
              Download PDF
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileJson size={18} />
              Export JSON
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
