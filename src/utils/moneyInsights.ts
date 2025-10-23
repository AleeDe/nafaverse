import { Transaction, Category, BudgetStatus } from '../types/money';

export const generateInsights = (
  transactions: Transaction[],
  budgetStatuses: BudgetStatus[]
): string[] => {
  const insights: string[] = [];

  const expenses = transactions.filter(t => t.type === 'Expense');

  if (expenses.length === 0) {
    return ['Start tracking your expenses to get insights!'];
  }

  const categoryTotals: Record<Category, number> = {
    Food: 0,
    Transport: 0,
    Shopping: 0,
    Education: 0,
    Bills: 0,
    Others: 0
  };

  expenses.forEach(exp => {
    categoryTotals[exp.category] += exp.amount;
  });

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .filter(([, amount]) => amount > 0);

  if (sortedCategories.length > 0) {
    const [topCategory] = sortedCategories[0];
    const emoji = getCategoryEmoji(topCategory as Category);
    insights.push(`You spent the most on ${topCategory} ${emoji}`);
  }

  budgetStatuses.forEach(status => {
    if (status.status === 'safe' && status.spent > 0) {
      const emoji = getCategoryEmoji(status.category);
      insights.push(`You're within your ${status.category} budget ${emoji}`);
    } else if (status.status === 'warning') {
      insights.push(`⚠️ Getting close to your ${status.category} limit`);
    } else if (status.status === 'danger') {
      insights.push(`🚨 You've exceeded your ${status.category} budget!`);
    }
  });

  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  if (totalIncome > 0 && totalExpenses > 0) {
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
    if (savingsRate > 20) {
      insights.push('💰 Great job saving money!');
    } else if (savingsRate < 0) {
      insights.push('📉 You\'re spending more than you earn');
    }
  }

  return insights.slice(0, 3);
};

const getCategoryEmoji = (category: Category): string => {
  const emojiMap: Record<Category, string> = {
    Food: '🍔',
    Transport: '🚗',
    Shopping: '🛍️',
    Education: '📚',
    Bills: '💡',
    Others: '📦'
  };
  return emojiMap[category] || '📊';
};
