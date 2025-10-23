import { Transaction, Budget } from '../types/money';

const STORAGE_KEY = 'nafaVerseExpenses';
const BUDGET_KEY = 'nafaVerseBudgets';

export const loadTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
};

export const addTransaction = (transaction: Transaction): void => {
  const transactions = loadTransactions();
  transactions.push(transaction);
  saveTransactions(transactions);
};

export const deleteTransaction = (id: string): void => {
  const transactions = loadTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  saveTransactions(filtered);
};

export const loadBudgets = (): Budget[] => {
  try {
    const data = localStorage.getItem(BUDGET_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading budgets:', error);
    return [];
  }
};

export const saveBudgets = (budgets: Budget[]): void => {
  try {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(budgets));
  } catch (error) {
    console.error('Error saving budgets:', error);
  }
};
