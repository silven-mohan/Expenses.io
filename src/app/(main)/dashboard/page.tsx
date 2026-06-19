'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore } from '@stores/appStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@components/ui';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Plus } from 'lucide-react';
import { formatCurrency, getCurrentMonth } from '@utils/dateUtils';
import { sumBy } from '@utils/helpers';
import Link from 'next/link';

export default function DashboardPage() {
  const { expenses, lent, borrowed, settings } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const { start, end } = getCurrentMonth();
  const monthExpenses = expenses.filter((e) => e.date >= start && e.date <= end);
  const currentMonthLent = lent.filter((l) => l.date >= start && l.date <= end);
  const currentMonthBorrowed = borrowed.filter((b) => b.date >= start && b.date <= end);

  const totalExpenses = sumBy(monthExpenses, (e) => e.amount);
  const totalLent = sumBy(currentMonthLent, (l) => l.amount);
  const totalBorrowed = sumBy(currentMonthBorrowed, (b) => b.amount);
  const pendingLent = sumBy(
    lent.filter((l) => l.status !== 'settled'),
    (l) => l.remainingAmount
  );
  const pendingBorrowed = sumBy(
    borrowed.filter((b) => b.status !== 'settled'),
    (b) => b.remainingAmount
  );

  const currencySymbol = settings?.currencySymbol || '₹';

  return (
    <div className="container-max py-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted mt-1">Welcome back to ExpenseLedger</p>
        </div>
        <Link href="/transactions">
          <Button className="flex items-center gap-2">
            <Plus size={18} />
            Add Transaction
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>Total Expenses</span>
              <TrendingUp className="text-danger-500" size={20} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalExpenses, currencySymbol)}</p>
            <p className="text-xs text-muted mt-2">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>Total Lent</span>
              <ArrowUpRight className="text-secondary-500" size={20} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalLent, currencySymbol)}</p>
            <p className="text-xs text-muted mt-2">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>Total Borrowed</span>
              <ArrowDownLeft className="text-accent-500" size={20} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalBorrowed, currencySymbol)}</p>
            <p className="text-xs text-muted mt-2">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>Balance</span>
              <TrendingUp className="text-primary-500" size={20} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(
                totalBorrowed - totalExpenses - totalLent,
                currencySymbol
              )}
            </p>
            <p className="text-xs text-muted mt-2">Net cash flow</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Debts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Pending Lent</CardTitle>
            <CardDescription>Money you lent that's still pending</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-secondary-600">
              {formatCurrency(pendingLent, currencySymbol)}
            </p>
            <p className="text-sm text-muted mt-2">
              {lent.filter((l) => l.status !== 'settled').length} pending transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Borrowed</CardTitle>
            <CardDescription>Money you borrowed that's still pending</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-accent-600">
              {formatCurrency(pendingBorrowed, currencySymbol)}
            </p>
            <p className="text-sm text-muted mt-2">
              {borrowed.filter((b) => b.status !== 'settled').length} pending transactions
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
