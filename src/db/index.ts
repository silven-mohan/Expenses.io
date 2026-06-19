import Dexie, { type Table } from 'dexie';
import type {
  Category,
  Expense,
  LentRecord,
  BorrowedRecord,
  Settlement,
  Settings,
} from '@types/index';

export class ExpenseLedgerDB extends Dexie {
  categories!: Table<Category>;
  expenses!: Table<Expense>;
  lent!: Table<LentRecord>;
  borrowed!: Table<BorrowedRecord>;
  settlements!: Table<Settlement>;
  settings!: Table<Settings>;

  constructor() {
    super('ExpenseLedgerDB');
    this.version(1).stores({
      categories: '++id, name, type',
      expenses: '++id, categoryId, date',
      lent: '++id, personName, date',
      borrowed: '++id, personName, date',
      settlements: '++id, recordId, type, date',
      settings: 'id',
    });
  }
}

export const db = new ExpenseLedgerDB();

export async function initializeDatabase() {
  try {
    const settingsCount = await db.settings.count();
    if (settingsCount === 0) {
      await db.settings.add({
        id: 'settings',
        theme: 'system',
        currency: 'INR',
        currencySymbol: '₹',
        locale: 'en-IN',
        updatedAt: Date.now(),
      });
    }

    const categoryCount = await db.categories.count();
    if (categoryCount === 0) {
      const defaultCategories: Category[] = [
        {
          id: 'cat_food',
          name: 'Food',
          type: 'expense',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'cat_transport',
          name: 'Transport',
          type: 'expense',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'cat_education',
          name: 'Education',
          type: 'expense',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'cat_shopping',
          name: 'Shopping',
          type: 'expense',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'cat_entertainment',
          name: 'Entertainment',
          type: 'expense',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'cat_rent',
          name: 'Rent',
          type: 'expense',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
      await db.categories.bulkAdd(defaultCategories);
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}
