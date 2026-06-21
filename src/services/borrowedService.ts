import { db } from '@db/index';
import type { BorrowedRecord } from '@/types';
import { generateId } from '@utils/helpers';

export async function getAllBorrowed(): Promise<BorrowedRecord[]> {
  try {
    return await db.borrowed.toArray();
  } catch (error) {
    console.error('Failed to fetch borrowed records:', error);
    throw error;
  }
}

export async function getBorrowedById(id: string): Promise<BorrowedRecord | undefined> {
  try {
    return await db.borrowed.get(id);
  } catch (error) {
    console.error('Failed to fetch borrowed record:', error);
    throw error;
  }
}

export async function getBorrowedByPerson(personName: string): Promise<BorrowedRecord[]> {
  try {
    return await db.borrowed.where('personName').equals(personName).toArray();
  } catch (error) {
    console.error('Failed to fetch borrowed by person:', error);
    throw error;
  }
}

export async function createBorrowed(
  personName: string,
  amount: number,
  date: number,
  note?: string
): Promise<BorrowedRecord> {
  const record: BorrowedRecord = {
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
    await db.borrowed.add(record);
    return record;
  } catch (error) {
    console.error('Failed to create borrowed record:', error);
    throw error;
  }
}

export async function updateBorrowed(
  id: string,
  updates: Partial<Omit<BorrowedRecord, 'id' | 'createdAt'>>
): Promise<BorrowedRecord | undefined> {
  try {
    const record = await db.borrowed.get(id);
    if (!record) throw new Error('Borrowed record not found');

    const updated: BorrowedRecord = {
      ...record,
      ...updates,
      updatedAt: Date.now(),
    };

    await db.borrowed.put(updated);
    return updated;
  } catch (error) {
    console.error('Failed to update borrowed record:', error);
    throw error;
  }
}

export async function settleBorrowed(
  id: string,
  paidAmount: number
): Promise<BorrowedRecord | undefined> {
  try {
    const record = await db.borrowed.get(id);
    if (!record) throw new Error('Borrowed record not found');

    const newPaidAmount = record.paidAmount + paidAmount;
    const remainingAmount = Math.max(0, record.amount - newPaidAmount);
    const status =
      remainingAmount === 0 ? 'settled' : newPaidAmount > 0 ? 'partially_settled' : 'pending';

    const updated: BorrowedRecord = {
      ...record,
      paidAmount: newPaidAmount,
      remainingAmount,
      status,
      updatedAt: Date.now(),
    };

    await db.borrowed.put(updated);
    return updated;
  } catch (error) {
    console.error('Failed to settle borrowed:', error);
    throw error;
  }
}

export async function deleteBorrowed(id: string): Promise<void> {
  try {
    await db.borrowed.delete(id);
  } catch (error) {
    console.error('Failed to delete borrowed record:', error);
    throw error;
  }
}
