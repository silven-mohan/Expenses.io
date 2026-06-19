'use client';

import React, { useState, useEffect } from 'react';
import { useExpenses } from '@hooks/useExpenses';
import { useAppStore } from '@stores/appStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatDate, getCurrentMonth } from '@utils/dateUtils';
import { groupBy, sumBy } from '@utils/helpers';
import { CHART_COLORS } from '@utils/constants';

export default function AnalyticsPage() {
  const { expenses } = useExpenses();
  const { categories, settings } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currencySymbol = settings?.currencySymbol || '₹';
  const { start, end } = getCurrentMonth();
  const monthExpenses = expenses.filter((e) => e.date >= start && e.date <= end);

  // Category breakdown
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const expensesByCategory = groupBy(monthExpenses, (e) => e.categoryId);
  const categoryData = Object.entries(expensesByCategory).map(([categoryId, items], index) => ({
    name: categoryMap[categoryId],
    value: sumBy(items, (e) => e.amount),
    color: CHART_COLORS[index % CHART_COLORS.length],
  }));

  // Daily expenses
  const dailyMap = groupBy(monthExpenses, (e) => formatDate(e.date, 'dd'));
  const dailyData = Object.entries(dailyMap)
    .map(([day, items]) => ({
      day,
      amount: sumBy(items, (e) => e.amount),
    }))
    .sort((a, b) => parseInt(a.day) - parseInt(b.day));

  const totalExpenses = sumBy(monthExpenses, (e) => e.amount);

  return (
    <div className="container-max py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted mt-1">Visualize your spending patterns</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalExpenses, currencySymbol)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Average Daily</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(dailyData.length > 0 ? totalExpenses / dailyData.length : 0, currencySymbol)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{categoryData.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number, currencySymbol)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Category Totals</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number, currencySymbol)} />
                <Bar dataKey="value" fill="#4F46E5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Daily Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Expenses Trend</CardTitle>
          <CardDescription>Spending pattern throughout the month</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number, currencySymbol)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={{ fill: '#4F46E5' }}
                name="Daily Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
