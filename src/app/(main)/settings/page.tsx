'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@stores/appStore';
import { updateSettings, createBackup, restoreBackup, downloadBackup } from '@services/index';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Select } from '@components/ui';
import { Download, Upload, RotateCcw } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { CURRENCY_SYMBOLS } from '@utils/constants';

export default function SettingsPage() {
  const { settings, setSettings } = useAppStore();
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    currency: 'INR',
    theme: 'system',
    locale: 'en-IN',
  });

  useEffect(() => {
    setMounted(true);
    if (settings) {
      setFormData({
        currency: settings.currency,
        theme: settings.theme,
        locale: settings.locale,
      });
    }
  }, [settings]);

  if (!mounted) return null;

  const handleUpdateSettings = async () => {
    try {
      const updated = await updateSettings({
        currency: formData.currency,
        currencySymbol: CURRENCY_SYMBOLS[formData.currency as keyof typeof CURRENCY_SYMBOLS] || '₹',
        theme: formData.theme as 'light' | 'dark' | 'system',
        locale: formData.locale,
      });
      if (updated) {
        setSettings(updated);
        setTheme(formData.theme);
        toast.success('Settings updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update settings');
      console.error('Failed to update settings:', error);
    }
  };

  const handleBackup = async () => {
    try {
      const backup = await createBackup();
      downloadBackup(backup, `expenseledger-backup-${new Date().getTime()}.json`);
      toast.success('Backup downloaded successfully');
    } catch (error) {
      toast.error('Failed to create backup');
      console.error('Failed to create backup:', error);
    }
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const backup = JSON.parse(text);
      await restoreBackup(backup);
      toast.success('Backup restored successfully');
      // Reload page to refresh data
      window.location.reload();
    } catch (error) {
      toast.error('Failed to restore backup');
      console.error('Failed to restore backup:', error);
    }
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      try {
        await restoreBackup({
          version: '1.0.0',
          exportedAt: Date.now(),
          categories: [],
          expenses: [],
          lent: [],
          borrowed: [],
          settlements: [],
          settings: null,
        });
        toast.success('All data has been reset');
        window.location.reload();
      } catch (error) {
        toast.error('Failed to reset data');
        console.error('Failed to reset data:', error);
      }
    }
  };

  return (
    <div className="container-max py-8 pb-24 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted mt-1">Customize your ExpenseLedger experience</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage your app preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium">Theme</label>
              <Select
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                className="mt-2"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </Select>
              <p className="text-xs text-muted mt-1">Choose your preferred theme</p>
            </div>

            <div>
              <label className="text-sm font-medium">Currency</label>
              <Select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="mt-2"
              >
                {Object.entries(CURRENCY_SYMBOLS).map(([code, symbol]) => (
                  <option key={code} value={code}>
                    {code} ({symbol})
                  </option>
                ))}
              </Select>
              <p className="text-xs text-muted mt-1">Choose your preferred currency</p>
            </div>

            <div>
              <label className="text-sm font-medium">Locale</label>
              <Select
                value={formData.locale}
                onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                className="mt-2"
              >
                <option value="en-IN">English (India)</option>
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
                <option value="de-DE">German</option>
              </Select>
              <p className="text-xs text-muted mt-1">Choose your preferred locale</p>
            </div>

            <Button onClick={handleUpdateSettings} className="w-full">
              Save Settings
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Backup, restore, or reset your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800">
              <p className="text-sm font-medium mb-3">Backup Your Data</p>
              <Button onClick={handleBackup} variant="secondary" className="w-full flex items-center justify-center gap-2">
                <Download size={18} />
                Download Backup
              </Button>
              <p className="text-xs text-muted mt-2">Save all your data locally as a JSON file</p>
            </div>

            <div className="p-4 rounded-lg bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800">
              <p className="text-sm font-medium mb-3">Restore from Backup</p>
              <label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestore}
                  className="hidden"
                />
                <Button variant="outline" className="w-full flex items-center justify-center gap-2 cursor-pointer">
                  <Upload size={18} />
                  Choose Backup File
                </Button>
              </label>
              <p className="text-xs text-muted mt-2">Restore data from a previously downloaded backup</p>
            </div>

            <div className="p-4 rounded-lg bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800">
              <p className="text-sm font-medium mb-3">Reset All Data</p>
              <Button variant="destructive" onClick={handleReset} className="w-full flex items-center justify-center gap-2">
                <RotateCcw size={18} />
                Reset Everything
              </Button>
              <p className="text-xs text-muted mt-2">⚠️ This will delete all your data permanently</p>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">ExpenseLedger</p>
              <p className="text-sm text-muted">v1.0.0</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Features</p>
              <ul className="text-sm text-muted space-y-1">
                <li>✓ Offline-first expense tracking</li>
                <li>✓ Debt management (lent/borrowed)</li>
                <li>✓ Advanced analytics</li>
                <li>✓ PDF and CSV export</li>
                <li>✓ PWA support</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
