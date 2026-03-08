import { IncomeEntry, IncomeGoal } from '@/types/brands';

export function getMonthlyRevenue(entries: IncomeEntry[], year: number, month: number): number {
  return entries
    .filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    })
    .reduce((sum, e) => sum + e.amount, 0);
}

export function getYearlyRevenue(entries: IncomeEntry[], year: number): number {
  return entries
    .filter(e => new Date(e.date).getFullYear() === year)
    .reduce((sum, e) => sum + e.amount, 0);
}

export function getGoalProgress(entries: IncomeEntry[], goal: IncomeGoal): number {
  const revenue = goal.period === 'monthly' && goal.month
    ? getMonthlyRevenue(entries, goal.year, goal.month)
    : getYearlyRevenue(entries, goal.year);
  return goal.targetAmount > 0 ? Math.min((revenue / goal.targetAmount) * 100, 100) : 0;
}

export function getRevenueByMonth(entries: IncomeEntry[], year: number) {
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const revenue = getMonthlyRevenue(entries, year, month);
    return { month: new Date(year, i).toLocaleString('default', { month: 'short' }), revenue };
  });
  return months;
}

export function getRevenueByCategory(entries: IncomeEntry[]) {
  const categories: Record<string, number> = {};
  entries.forEach(e => {
    categories[e.category] = (categories[e.category] || 0) + e.amount;
  });
  return Object.entries(categories).map(([name, value]) => ({ name, value }));
}
