import { db } from '@db/index';
import type { BackupData } from '@/types';

const BACKUP_VERSION = '1.0.0';

export async function createBackup(): Promise<BackupData> {
  try {
    const [categories, expenses, lent, borrowed, settlements, settings] = await Promise.all([
      db.categories.toArray(),
      db.expenses.toArray(),
      db.lent.toArray(),
      db.borrowed.toArray(),
      db.settlements.toArray(),
      db.settings.get('settings').then(s => s ?? null),
    ]);

    return {
      version: BACKUP_VERSION,
      exportedAt: Date.now(),
      categories,
      expenses,
      lent,
      borrowed,
      settlements,
      settings,
    };
  } catch (error) {
    console.error('Failed to create backup:', error);
    throw error;
  }
}

export async function restoreBackup(backup: BackupData): Promise<void> {
  try {
    // Validate backup version
    if (!backup.version || !backup.exportedAt) {
      throw new Error('Invalid backup format');
    }

    // Clear existing data
    await Promise.all([
      db.categories.clear(),
      db.expenses.clear(),
      db.lent.clear(),
      db.borrowed.clear(),
      db.settlements.clear(),
    ]);

    // Restore data
    if (backup.categories.length > 0) {
      await db.categories.bulkAdd(backup.categories);
    }
    if (backup.expenses.length > 0) {
      await db.expenses.bulkAdd(backup.expenses);
    }
    if (backup.lent.length > 0) {
      await db.lent.bulkAdd(backup.lent);
    }
    if (backup.borrowed.length > 0) {
      await db.borrowed.bulkAdd(backup.borrowed);
    }
    if (backup.settlements.length > 0) {
      await db.settlements.bulkAdd(backup.settlements);
    }
    if (backup.settings) {
      await db.settings.put(backup.settings);
    }
  } catch (error) {
    console.error('Failed to restore backup:', error);
    throw error;
  }
}

export function downloadBackup(data: BackupData, filename: string = 'expenseledger-backup.json'): void {
  try {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download backup:', error);
    throw error;
  }
}
