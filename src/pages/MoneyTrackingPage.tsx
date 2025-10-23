import React, { useState, useEffect } from 'react';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus, Trash2, DollarSign, TrendingUp, TrendingDown, Target, User } from 'lucide-react';
import { useDashboard } from '../components/DashboardContext';
import { DashboardSheet } from '../components/DashboardSheet';
import { Transaction, Category, TransactionType, Budget, BudgetStatus } from '../types/money';
import { loadTransactions, addTransaction, deleteTransaction, loadBudgets, saveBudgets } from '../utils/moneyStorage';
import { generateInsights } from '../utils/moneyInsights';

const CATEGORIES: Category[] = ['Food', 'Transport', 'Shopping', 'Education', 'Bills', 'Others'];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const MoneyTrackingPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food' as Category,
    type: 'Expense' as TransactionType,
    date: new Date().toISOString().split('T')[0]
  });

  const [budgetCategory, setBudgetCategory] = useState<Category>('Food');
  const [budgetLimit, setBudgetLimit] = useState('');

  useEffect(() => {
    setTransactions(loadTransactions());
    setBudgets(loadBudgets());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      date: formData.date
    };

    addTransaction(newTransaction);
    setTransactions(loadTransactions());
    setFormData({
      title: '',
      amount: '',
      category: 'Food',
      type: 'Expense',
      date: new Date().toISOString().split('T')[0]
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    setTransactions(loadTransactions());
  };

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const existingBudgets = loadBudgets();
    const filtered = existingBudgets.filter(b => b.category !== budgetCategory);
    const newBudget: Budget = {
      category: budgetCategory,
      limit: parseFloat(budgetLimit)
    };
    filtered.push(newBudget);
    saveBudgets(filtered);
    setBudgets(filtered);
    setBudgetLimit('');
    setShowBudgetForm(false);
  };

  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const categoryData = CATEGORIES.map(cat => ({
    name: cat,
    value: transactions.filter(t => t.type === 'Expense' && t.category === cat).reduce((sum, t) => sum + t.amount, 0)
  })).filter(d => d.value > 0);

  const dailyData = transactions.reduce((acc, t) => {
    const existing = acc.find(d => d.date === t.date);
    if (existing) {
      if (t.type === 'Expense') existing.expense += t.amount;
      else existing.income += t.amount;
    } else {
      acc.push({
        date: t.date,
        expense: t.type === 'Expense' ? t.amount : 0,
        income: t.type === 'Income' ? t.amount : 0
      });
    }
    return acc;
  }, [] as { date: string; expense: number; income: number }[]).slice(-7);

  const budgetStatuses: BudgetStatus[] = budgets.map(budget => {
    const spent = transactions
      .filter(t => t.type === 'Expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    const percentage = (spent / budget.limit) * 100;
    const status = percentage >= 100 ? 'danger' : percentage >= 80 ? 'warning' : 'safe';
    return { category: budget.category, spent, limit: budget.limit, percentage, status };
  });

  const insights = generateInsights(transactions, budgetStatuses);

  const { dashboardOpen, setDashboardOpen } = useDashboard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f3e8ff] py-12 px-4 pt-28 sm:pt-24">
      {/* Dashboard Toggle + Sheet */}
      {!dashboardOpen && (
        <div className="fixed top-[80px] left-[30px] z-[1100]">
          <button
            onClick={() => setDashboardOpen(true)}
            className="bg-gradient-to-br from-purple-400 to-blue-500 text-white w-12 h-11 flex items-center justify-center rounded-xl shadow-lg hover:shadow-blue-500/30 transition-shadow"
            aria-label="Open Dashboard"
          >
            <User className="w-6 h-6" />
          </button>
        </div>
      )}
      <DashboardSheet />
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 pt-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">Money Tracking</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your finances with ease</p>
          <div className="mt-3">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-3 rounded-md text-sm">
              Note: This page is currently in a working phase. Data is stored locally in your browser (localStorage) and may be cleared if you clear your browser data or use a different device.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">Total Income</span>
              <TrendingUp className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-800">PKR {totalIncome.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">Total Expenses</span>
              <TrendingDown className="text-red-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-800">PKR {totalExpenses.toFixed(2)}</p>
          </div>

          <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${balance >= 0 ? 'border-blue-500' : 'border-orange-500'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">Balance</span>
              <DollarSign className={balance >= 0 ? 'text-blue-500' : 'text-orange-500'} size={24} />
            </div>
            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-slate-800' : 'text-orange-600'}`}>
              PKR {balance.toFixed(2)}
            </p>
          </div>
        </div>

        {insights.length > 0 && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 mb-8 text-white">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target size={24} />
              Smart Insights
            </h3>
            <div className="space-y-2">
              {insights.map((insight, idx) => (
                <p key={idx} className="text-blue-50">{insight}</p>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {categoryData.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Spending by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props: any) => {
                      const name = props?.name ?? '';
                      const percent = props?.percent ?? 0;
                      return `${name} ${((percent) * 100).toFixed(0)}%`;
                    }}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {dailyData.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Daily Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" name="Income" />
                  <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {budgetStatuses.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Budget Status</h3>
            <div className="space-y-4">
              {budgetStatuses.map(status => (
                <div key={status.category}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-slate-700">{status.category}</span>
                    <span className="text-slate-600">
                      PKR {status.spent.toFixed(2)} / PKR {status.limit.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        status.status === 'danger' ? 'bg-red-500' :
                        status.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(status.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h3 className="text-xl font-bold text-slate-800">Transactions</h3>
            {/* Buttons moved under heading and made smaller */}
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowBudgetForm(!showBudgetForm)}
                className="w-full sm:w-auto px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center gap-2 justify-center text-sm"
              >
                <Target size={16} />
                <span className="hidden sm:inline">Set Budget</span>
                <span className="sm:hidden">Budget</span>
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full sm:w-auto px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition flex items-center gap-2 justify-center text-sm"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Add Transaction</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>

          {showBudgetForm && (
            <form onSubmit={handleBudgetSubmit} className="mb-6 p-6 bg-blue-50 rounded-xl">
              <h4 className="font-bold text-slate-800 mb-4">Set Category Budget</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={budgetCategory}
                    onChange={(e) => setBudgetCategory(e.target.value as Category)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Limit (PKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowBudgetForm(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Save Budget
                </button>
              </div>
            </form>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-6 bg-slate-50 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-slate-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Amount (PKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-slate-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  >
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No transactions yet. Add your first transaction!</p>
            ) : (
              transactions.map(transaction => (
                <div
                    key={transaction.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                    <h4 className="font-medium text-slate-800 truncate">{transaction.title}</h4>
                    <div className="flex flex-wrap gap-2 mt-2 items-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transaction.type === 'Income'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {transaction.type}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        {transaction.category}
                      </span>
                      <span className="text-xs text-slate-500">{transaction.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-0 sm:ml-4">
                    <span className={`text-lg font-bold ${
                      transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'Income' ? '+' : '-'} PKR {transaction.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoneyTrackingPage;
