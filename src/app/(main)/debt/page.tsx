'use client';

import React, { useState, useEffect } from 'react';
import { useLent } from '@hooks/useLent';
import { useBorrowed } from '@hooks/useBorrowed';
import { useAppStore } from '@stores/appStore';
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from '@components/ui';
import { Plus, Trash2, Check } from 'lucide-react';
import { formatCurrency, formatDate } from '@utils/dateUtils';
import { sumBy } from '@utils/helpers';

export default function DebtPage() {
  const { lent, createLent, settleLent, deleteLent } = useLent();
  const { borrowed, createBorrowed, settleBorrowed, deleteBorrowed } = useBorrowed();
  const { settings } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'lent' | 'borrowed'>('lent');
  const [formData, setFormData] = useState({
    personName: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currencySymbol = settings?.currencySymbol || '₹';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.personName || !formData.amount) return;

    try {
      if (activeTab === 'lent') {
        await createLent(
          formData.personName,
          parseFloat(formData.amount),
          new Date(formData.date).getTime(),
          formData.note
        );
      } else {
        await createBorrowed(
          formData.personName,
          parseFloat(formData.amount),
          new Date(formData.date).getTime(),
          formData.note
        );
      }
      setFormData({
        personName: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
      });
    } catch (error) {
      console.error('Failed to create record:', error);
    }
  };

  const records = activeTab === 'lent' ? lent : borrowed;
  const handleDelete = activeTab === 'lent' ? deleteLent : deleteBorrowed;
  const handleSettle = activeTab === 'lent' ? settleLent : settleBorrowed;

  const totalAmount = sumBy(records, (r) => r.amount);
  const totalRemaining = sumBy(records, (r) => r.remainingAmount);
  const settled = records.filter((r) => r.status === 'settled').length;

  return (
    <div className="container-max py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Debt Tracking</h1>
        <p className="text-muted mt-1">Track money you lent and borrowed</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-primary-200 dark:border-primary-800">
        <button
          onClick={() => setActiveTab('lent')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'lent'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-muted hover:text-primary-600'
          }`}
        >
          Lent ({lent.length})
        </button>
        <button
          onClick={() => setActiveTab('borrowed')}
          className={`pb-3 px-4 font-medium transition-colors ${
            activeTab === 'borrowed'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-muted hover:text-primary-600'
          }`}
        >
          Borrowed ({borrowed.length})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus size={20} />
              Add {activeTab === 'lent' ? 'Lent' : 'Borrowed'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Person Name</label>
                <Input
                  value={formData.personName}
                  onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                  placeholder="Enter name"
                  className="mt-1"
                />
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
                Add {activeTab === 'lent' ? 'Lent' : 'Borrowed'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Summary & Records */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted mb-1">Total</p>
                <p className="text-lg font-bold">{formatCurrency(totalAmount, currencySymbol)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted mb-1">Settled</p>
                <p className="text-lg font-bold">{settled}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted mb-1">Pending</p>
                <p className="text-lg font-bold">{formatCurrency(totalRemaining, currencySymbol)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Records List */}
          <Card>
            <CardHeader>
              <CardTitle>Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {records.length === 0 ? (
                  <p className="text-muted text-center py-8">No records yet</p>
                ) : (
                  records.map((record) => (
                    <div key={record.id} className="p-3 rounded-lg border border-primary-200 dark:border-primary-800">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{record.personName}</p>
                          <p className="text-xs text-muted">{formatDate(record.date, 'MMM dd, yyyy')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(record.amount, currencySymbol)}</p>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              record.status === 'settled'
                                ? 'bg-secondary-100 text-secondary-800'
                                : record.status === 'partially_settled'
                                ? 'bg-accent-100 text-accent-800'
                                : 'bg-primary-100 text-primary-800'
                            }`}
                          >
                            {record.status}
                          </span>
                        </div>
                      </div>
                      {record.remainingAmount > 0 && (
                        <div className="mb-2">
                          <p className="text-xs text-muted">Remaining: {formatCurrency(record.remainingAmount, currencySymbol)}</p>
                        </div>
                      )}
                      <div className="flex gap-2">
                        {record.remainingAmount > 0 && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleSettle(record.id, record.remainingAmount)}
                            className="flex items-center gap-1"
                          >
                            <Check size={14} />
                            Settle
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(record.id)}
                          className="text-danger-500"
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
