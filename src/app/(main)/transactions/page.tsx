'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@utils/dateUtils';
import { useExpenses } from '@hooks/useExpenses';
import { useAppStore } from '@stores/appStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, Button, Select, Input } from '@components/ui';

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
  const sortedExpenses = [...expenses].sort((a, b) => b.date - a.date);

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

        {/* Transaction List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>{sortedExpenses.length} total expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {sortedExpenses.length === 0 ? (
                  <p className="text-muted text-center py-8">No transactions yet. Add your first expense!</p>
                ) : (
                  sortedExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors"
                    >
                      <div>
                        <p className="font-medium">{categoryMap[expense.categoryId] || 'Unknown'}</p>
                        <p className="text-xs text-muted">{formatDate(expense.date, 'MMM dd, yyyy')}</p>
                        {expense.note && (
                          <p className="text-xs text-muted mt-1">{expense.note}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-bold">{formatCurrency(expense.amount, currencySymbol)}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteExpense(expense.id)}
                          className="text-danger-500 hover:text-danger-600"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
