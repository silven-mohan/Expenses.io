import { db } from '@db/index';
import type { LentRecord } from '@/types';
import { generateId } from '@utils/helpers';

export async function getAllLent(): Promise<LentRecord[]> {
  try {
    return await db.lent.toArray();
  } catch (error) {
    console.error('Failed to fetch lent records:', error);
    throw error;
  }
}

export async function getLentById(id: string): Promise<LentRecord | undefined> {
  try {
    return await db.lent.get(id);
  } catch (error) {
    console.error('Failed to fetch lent record:', error);
    throw error;
  }
}

export async function getLentByPerson(personName: string): Promise<LentRecord[]> {
  try {
    return await db.lent.where('personName').equals(personName).toArray();
  } catch (error) {
    console.error('Failed to fetch lent by person:', error);
    throw error;
  }
}

export async function createLent(
  personName: string,
  amount: number,
  date: number,
  note?: string
): Promise<LentRecord> {
  const record: LentRecord = {
    id: generateId(),
    personName,
    amount,
    paidAmount: 0,
    remainingAmount: amount,
    status: 'pending',
    note,
    date,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  try {
    await db.lent.add(record);
    return record;
  } catch (error) {
    console.error('Failed to create lent record:', error);
    throw error;
  }
}

export async function updateLent(
  id: string,
  updates: Partial<Omit<LentRecord, 'id' | 'createdAt'>>
): Promise<LentRecord | undefined> {
  try {
    const record = await db.lent.get(id);
    if (!record) throw new Error('Lent record not found');

    const updated: LentRecord = {
      ...record,
      ...updates,
      updatedAt: Date.now(),
    };

    await db.lent.put(updated);
    return updated;
  } catch (error) {
    console.error('Failed to update lent record:', error);
    throw error;
  }
}

export async function settleLent(
  id: string,
  paidAmount: number
): Promise<LentRecord | undefined> {
  try {
    const record = await db.lent.get(id);
    if (!record) throw new Error('Lent record not found');

    const newPaidAmount = record.paidAmount + paidAmount;
    const remainingAmount = Math.max(0, record.amount - newPaidAmount);
    const status =
      remainingAmount === 0 ? 'settled' : newPaidAmount > 0 ? 'partially_settled' : 'pending';

    const updated: LentRecord = {
      ...record,
      paidAmount: newPaidAmount,
      remainingAmount,
      status,
      updatedAt: Date.now(),
    };

    await db.lent.put(updated);
    return updated;
  } catch (error) {
    console.error('Failed to settle lent:', error);
    throw error;
  }
}

export async function deleteLent(id: string): Promise<void> {
  try {
    await db.lent.delete(id);
  } catch (error) {
    console.error('Failed to delete lent record:', error);
    throw error;
  }
}
