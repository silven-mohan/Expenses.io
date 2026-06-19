export type CategoryType = 'expense' | 'income';

export interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  type: CategoryType;
  createdAt: number;
  updatedAt: number;
}

export interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  note?: string;
  date: number;
  createdAt: number;
  updatedAt: number;
}

export type DebtStatus = 'pending' | 'partially_settled' | 'settled';

export interface DebtRecord {
  id: string;
  personName: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  status: DebtStatus;
  note?: string;
  date: number;
  createdAt: number;
  updatedAt: number;
}

export interface LentRecord extends DebtRecord {}
export interface BorrowedRecord extends DebtRecord {}

export type SettlementType = 'lent' | 'borrowed';

export interface Settlement {
  id: string;
  recordId: string;
  amount: number;
  type: SettlementType;
  date: number;
  note?: string;
  createdAt: number;
}

export interface Settings {
  id: 'settings';
  theme: 'light' | 'dark' | 'system';
  currency: string;
  currencySymbol: string;
  locale: string;
  updatedAt: number;
}

export interface MonthlyReport {
  month: number;
  year: number;
  expenses: {
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
  }[];
  totalExpenses: number;
  totalLent: number;
  totalBorrowed: number;
  netCashFlow: number;
  generatedAt: number;
}

export interface AnalyticsData {
  period: 'day' | 'week' | 'month' | 'year';
  data: {
    date: string;
    amount: number;
    category?: string;
  }[];
  total: number;
  average: number;
}

export interface BackupData {
  version: string;
  exportedAt: number;
  categories: Category[];
  expenses: Expense[];
  lent: LentRecord[];
  borrowed: BorrowedRecord[];
  settlements: Settlement[];
  settings: Settings | null;
}
