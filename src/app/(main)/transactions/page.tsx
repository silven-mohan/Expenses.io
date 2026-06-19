'use client';

import React, { useState, useEffect } from 'react';
import { useExpenses } from '@hooks/useExpenses';
import { useAppStore } from '@stores/appStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Select } from '@components/ui';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@utils/dateUtils';
import { groupBy, sumBy } from '@utils/helpers';

export default function TransactionsPage() {
  const { expenses, createExpense, deleteExpense } = useExpenses();
  const { categories, settings } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  useEffect(() => {
    setMounted(true);
    if (categories.length > 0 && !formData.categoryId) {
      setFormData((prev) => ({
        ...prev,
        categoryId: categories[0].id,
      }));
    }
  }, [categories, formData.categoryId]);

  if (!mounted) return null;

  const currencySymbol = settings?.currencySymbol || '₹';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.amount) return;

    try {
      await createExpense(
        formData.categoryId,
        parseFloat(formData.amount),
        new Date(formData.date).getTime(),
        formData.note
      );
      setFormData({
        categoryId: categories[0]?.id || '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
      });
    } catch (error) {
      console.error('Failed to create expense:', error);
    }
  };

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const expensesByCategory = groupBy(expenses, (e) => e.categoryId);
  const sortedExpenses = expenses.sort((a, b) => b.date - a.date);

  return (
    <div className="container-max py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <p className="text-muted mt-1">Manage your expenses and income</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Transaction Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus size={20} />
              Add Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="mt-1"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Note</label>
                <Input
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Optional"
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full">
                Add Expense
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>{expenses.length} total transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {sortedExpenses.length === 0 ? (
                <p className="text-muted text-center py-8">No transactions yet</p>
              ) : (
                sortedExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900">
                    <div className="flex-1">
                      <p className="font-medium">{categoryMap[expense.categoryId]}</p>
                      <p className="text-xs text-muted">{formatDate(expense.date, 'MMM dd, yyyy')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold">{formatCurrency(expense.amount, currencySymbol)}</p>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="text-danger-500 hover:text-danger-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Summary */}
      {Object.keys(expensesByCategory).length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(expensesByCategory).map(([categoryId, items]) => (
                <div key={categoryId} className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900">
                  <p className="text-sm font-medium text-muted">{categoryMap[categoryId]}</p>
                  <p className="text-2xl font-bold mt-2">{formatCurrency(sumBy(items, (e) => e.amount), currencySymbol)}</p>
                  <p className="text-xs text-muted mt-1">{items.length} transactions</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
