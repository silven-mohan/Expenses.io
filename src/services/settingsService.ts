import { db } from '@db/index';
import type { Settings } from '@/types';

export async function getSettings(): Promise<Settings | null> {
  try {
    return (await db.settings.get('settings')) ?? null;
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    throw error;
  }
}

export async function updateSettings(
  updates: Partial<Omit<Settings, 'id' | 'createdAt'>>
): Promise<Settings | undefined> {
  try {
    const settings = await db.settings.get('settings');
    if (!settings) throw new Error('Settings not found');

    const updated: Settings = {
      ...settings,
      ...updates,
      updatedAt: Date.now(),
    };

    await db.settings.put(updated);
    return updated;
  } catch (error) {
    console.error('Failed to update settings:', error);
    throw error;
  }
}
