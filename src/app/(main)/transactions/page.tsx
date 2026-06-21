import { Plus, Trash2, Edit2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@utils/dateUtils';
import { groupBy, sumBy } from '@utils/helpers';
import { useExpenses } from '@hooks/useExpenses';
import { useAppStore } from '@stores/appStore';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@components/ui/Card';
import { Select } from '@components/ui/Select';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui';
import Link from 'next/link';
import { Trash2 as TrashIcon } from 'lucide-react';

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
