import React, { useState, useEffect } from 'react';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Plus, Trash2, DollarSign, TrendingUp, TrendingDown, Target, User, Calendar } from 'lucide-react';
import { useDashboard } from '../components/DashboardContext';
import { DashboardSheet } from '../components/DashboardSheet';
import { Transaction, Category, TransactionType, Budget, BudgetStatus } from '../types/money';
import { loadTransactions, addTransaction, deleteTransaction, loadBudgets, saveBudgets } from '../utils/moneyStorage';
import { generateInsights } from '../utils/moneyInsights';

const CATEGORIES: Category[] = ['Food', 'Transport', 'Shopping', 'Education', 'Bills', 'Others'];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// Map categories to icon and color for nicer UI
const CATEGORY_META: Record<Category, { icon: string; color: string }> = {
  Food: { icon: '🍔', color: '#F97316' },
  Transport: { icon: '🚌', color: '#3B82F6' },
  Shopping: { icon: '🛍️', color: '#EC4899' },
  Education: { icon: '📚', color: '#10B981' },
  Bills: { icon: '🧾', color: '#EF4444' },
  Others: { icon: '🔖', color: '#8B5CF6' }
};

const MoneyTrackingPage: React.FC = () => {
  // Simple custom select to avoid native white dropdowns on some OSes
  const CustomSelect: React.FC<{
    value: string;
    onChange: (v: string) => void;
    options: string[];
    className?: string;
  }> = ({ value, onChange, options, className }) => {
    const [open, setOpen] = useState(false);
    return (
      <div className={`relative ${className ?? ''}`}>
        <button type="button" onClick={() => setOpen(!open)} className="w-full text-left px-4 py-2 border border-white/10 rounded-lg bg-transparent text-white flex items-center justify-between">
          <span>{value}</span>
          <svg className="w-4 h-4 opacity-80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {open && (
          <div className="absolute z-50 mt-2 w-full bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81] border border-white/10 rounded-lg shadow-lg"> 
            {options.map(opt => (
              <div key={opt} onClick={() => { onChange(opt); setOpen(false); }} className="px-4 py-2 hover:bg-white/5 cursor-pointer text-white">{opt}</div>
            ))}
          </div>
        )}
      </div>
    );
  };
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
  <div className="min-h-screen py-12 px-4 pt-28 sm:pt-24 bg-gradient-to-br from-[#1E1B4B] via-[#0F0A2E] to-[#312E81] text-white">
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">Money Tracking</h1>
          <p className="text-sm sm:text-base text-slate-300">Manage your finances with ease</p>
          <div className="mt-3">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-3 rounded-md text-sm">
              Note: This page is currently in a working phase. Data is stored locally in your browser (localStorage) and may be cleared if you clear your browser data or use a different device.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="nv-card p-6 flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#7C3AED] to-[#06B6D4] opacity-80" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-200">Total Income</span>
                <TrendingUp className="text-green-400" size={22} />
              </div>
              <p className="text-3xl font-bold text-white">PKR {totalIncome.toFixed(2)}</p>
            </div>
            <div style={{width:150,height:60}} className="flex-shrink-0">
              <ResponsiveContainer width="100%" height={60}>
                <LineChart data={dailyData.map(d=>({date:d.date, value:d.income}))}>
                  <defs>
                    <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#9f7aea" stopOpacity={0.6}/>
                      <stop offset="100%" stopColor="#9f7aea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide />
                  <YAxis hide domain={[0, 'dataMax']} />
                  <Tooltip wrapperStyle={{display:'none'}} />
                  <Line type="monotone" dataKey="value" stroke="#A786DF" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="nv-card p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-200">Total Expenses</span>
              <TrendingDown className="text-red-500" size={24} />
            </div>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold text-white">PKR {totalExpenses.toFixed(2)}</p>
              <div style={{width:120,height:50}}>
                <ResponsiveContainer width="100%" height={50}>
                  <LineChart data={dailyData.map(d=>({date:d.date, value:d.expense}))}>
                    <XAxis dataKey="date" hide />
                    <YAxis hide domain={[0, 'dataMax']} />
                    <Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className={`nv-card p-6 ${balance >= 0 ? 'border-l-4 border-[#4B3F72]' : 'border-l-4 border-orange-500'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-200">Balance</span>
              <DollarSign className={balance >= 0 ? 'text-[#4B3F72]' : 'text-orange-500'} size={24} />
            </div>
            <div className="flex items-center gap-4">
              <p className={`text-3xl font-bold ${balance >= 0 ? 'text-white' : 'text-orange-400'}`}>
                PKR {balance.toFixed(2)}
              </p>
              <div style={{width:120,height:50}}>
                <ResponsiveContainer width="100%" height={50}>
                  <LineChart data={dailyData.map(d=>({date:d.date, value:(d.income - d.expense)}))}>
                    <XAxis dataKey="date" hide />
                    <YAxis hide domain={['dataMin', 'dataMax']} />
                    <Line type="monotone" dataKey="value" stroke={balance >= 0 ? '#4B3F72' : '#F97316'} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {insights.length > 0 && (
          <div className="nv-card p-6 mb-8 text-white">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target size={24} />
              Smart Insights
            </h3>
            <div className="space-y-2">
              {insights.map((insight, idx) => (
                <p key={idx} className="text-slate-200">{insight}</p>
              ))}
            </div>
          </div>
        )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {categoryData.length > 0 && (
            <div className="nv-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">Spending by Category</h3>
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
            <div className="nv-card p-6">
              <h3 className="text-xl font-bold text-white mb-4">Daily Overview</h3>
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
          <div className="nv-card p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Budget Status</h3>
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

        <div className="nv-card p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h3 className="text-xl font-bold text-white">Transactions</h3>
            {/* Buttons moved under heading and made smaller */}
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowBudgetForm(!showBudgetForm)}
                className="w-full sm:w-auto px-3 py-1.5 nv-glow-btn text-sm"
              >
                <Target size={16} />
                <span className="hidden sm:inline">Set Budget</span>
                <span className="sm:hidden">Budget</span>
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full sm:w-auto px-3 py-1.5 nv-glow-btn text-sm"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Add Transaction</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>

          {showBudgetForm && (
            <form onSubmit={handleBudgetSubmit} className="mb-6 p-6 bg-[rgba(255,255,255,0.04)] rounded-xl">
              <h4 className="font-bold text-white mb-4">Set Category Budget</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Category</label>
                  <CustomSelect
                    value={budgetCategory}
                    onChange={(v) => setBudgetCategory(v as Category)}
                    options={CATEGORIES}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Limit (PKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                    className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-[rgba(167,134,223,0.3)] focus:border-transparent bg-transparent text-white placeholder:text-white/60"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowBudgetForm(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="nv-glow-btn px-6 py-2"
                >
                  Save Budget
                </button>
              </div>
            </form>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-6 bg-[rgba(255,255,255,0.03)] rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-[rgba(167,134,223,0.3)] focus:border-transparent bg-transparent text-white placeholder:text-white/60"
                    placeholder="e.g., Grocery shopping"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Amount (PKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-[rgba(167,134,223,0.3)] focus:border-transparent bg-transparent text-white placeholder:text-white/60"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Category</label>
                  <CustomSelect
                    value={formData.category}
                    onChange={(v) => setFormData({ ...formData, category: v as Category })}
                    options={CATEGORIES}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Type</label>
                  <CustomSelect
                    value={formData.type}
                    onChange={(v) => setFormData({ ...formData, type: v as TransactionType })}
                    options={[ 'Expense', 'Income' ]}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-[rgba(167,134,223,0.3)] focus:border-transparent bg-transparent text-white placeholder:text-white/60"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="nv-glow-btn px-6 py-2"
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
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 nv-card animate-scaleIn"
                    style={{ animationDelay: `${Math.min(0.4, transactions.indexOf(transaction) * 0.06)}s` }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0 mb-3 sm:mb-0">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0" style={{background: `${CATEGORY_META[transaction.category].color}20`}}>
                        <span className="text-lg" aria-hidden>{CATEGORY_META[transaction.category].icon}</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-white truncate">{transaction.title}</h4>
                        <div className="flex flex-wrap gap-2 mt-1 items-center text-xs">
                          <span className={`px-2 py-0.5 rounded-full ${transaction.type === 'Income' ? 'bg-green-800/30 text-white' : 'bg-red-800/30 text-white'}`}>{transaction.type}</span>
                          <span className="px-2 py-0.5 rounded-full bg-white/5 text-white">{transaction.category}</span>
                          <span className="text-white/60 flex items-center gap-1"><Calendar className="text-white/60" size={12}/> {transaction.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-0 sm:ml-4">
                      <div className={`px-3 py-1 rounded-full font-semibold ${transaction.type === 'Income' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                        {transaction.type === 'Income' ? '+' : '-'} PKR {transaction.amount.toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                        aria-label={`Delete ${transaction.title}`}
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
