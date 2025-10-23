export type TransactionType = 'Income' | 'Expense';

export type Category = 'Food' | 'Transport' | 'Shopping' | 'Education' | 'Bills' | 'Others';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: Category;
  type: TransactionType;
  date: string;
}

export interface Budget {
  category: Category;
  limit: number;
}

export interface BudgetStatus {
  category: Category;
  spent: number;
  limit: number;
  percentage: number;
  status: 'safe' | 'warning' | 'danger';
}
