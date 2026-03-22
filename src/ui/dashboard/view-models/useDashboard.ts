import { useEffect } from 'react';
import { useDashboardStore } from '../stores/dashboard-store';

export function useDashboard() {
  const {
    totalBalance,
    monthlyIncome,
    monthlyExpense,
    topCategories,
    recentTransactions,
    accounts,
    isLoading,
    error,
    fetchDashboardData
  } = useDashboardStore();

  return {
    totalBalance,
    monthlyIncome,
    monthlyExpense,
    topCategories,
    recentTransactions,
    accounts,
    isLoading,
    error,
    fetchDashboardData
  };
}
