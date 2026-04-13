import { accountsRepository } from '@/src/data/repositories/accounts/accounts-repository';
import { transactionsRepository } from '@/src/data/repositories/transactions/transactions-repository';
import type { TransactionWithCategory } from '@/src/data/services/transactions/transactions-service';
import type { Account } from '@/src/domain/models/accounts/account.model';
import { create } from 'zustand';

export interface CategoryExpense {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color?: string;
}

interface DashboardState {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  topCategories: CategoryExpense[];
  recentTransactions: TransactionWithCategory[];
  accounts: Account[];
  isLoading: boolean;
  error: string | null;

  fetchDashboardData: () => Promise<void>;
  reset: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  totalBalance: 0,
  monthlyIncome: 0,
  monthlyExpense: 0,
  topCategories: [],
  recentTransactions: [],
  accounts: [],
  isLoading: false,
  error: null,

  reset: () =>
    set({
      totalBalance: 0,
      monthlyIncome: 0,
      monthlyExpense: 0,
      topCategories: [],
      recentTransactions: [],
      accounts: [],
      isLoading: false,
      error: null,
    }),

  fetchDashboardData: async () => {
    try {
      set({ isLoading: true, error: null });

      const now = new Date();
      const startOfMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

      // Calculate the end of the month
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      nextMonth.setMilliseconds(nextMonth.getMilliseconds() - 1);
      const endOfMonthStr = nextMonth.toISOString().split('T')[0];

      const [accountsRes, monthlyTxRes, recentTxRes] = await Promise.all([
        accountsRepository.getAll(),
        transactionsRepository.getByDateRange(startOfMonthStr, endOfMonthStr),
        transactionsRepository.getRecent(3),
      ]);

      if (accountsRes.error) throw new Error(accountsRes.error.message || 'Error fetching accounts');
      if (monthlyTxRes.error) throw new Error(monthlyTxRes.error.message || 'Error fetching monthly transactions');
      if (recentTxRes.error) throw new Error(recentTxRes.error.message || 'Error fetching recent transactions');

      // 1. Total Balance
      const fetchedAccounts = accountsRes.data || [];
      const balance = fetchedAccounts.reduce((acc, account) => acc + Number(account.balance), 0);

      // 2. Monthly Income & Expense
      const monthlyTxs = monthlyTxRes.data || [];
      const income = monthlyTxs.filter((tx) => tx.type === 'income').reduce((acc, tx) => acc + Number(tx.amount), 0);
      const expense = monthlyTxs.filter((tx) => tx.type === 'expense').reduce((acc, tx) => acc + Number(tx.amount), 0);

      // 3. Top 2 Categories by Expense
      const expenseTxs = monthlyTxs.filter((tx) => tx.type === 'expense' && tx.category_id);
      const categoryMap = new Map<string, { name: string; amount: number; color?: string }>();

      for (const tx of expenseTxs) {
        if (!tx.category_id || !tx.categories) continue;
        const existing = categoryMap.get(tx.category_id) || {
          name: tx.categories.name,
          amount: 0,
          color: tx.categories.color ?? undefined,
        };
        existing.amount += Number(tx.amount);
        categoryMap.set(tx.category_id, existing);
      }

      const totalExpensesForCategories = Array.from(categoryMap.values()).reduce((acc, cat) => acc + cat.amount, 0);

      const sortedCategories = Array.from(categoryMap.entries())
        .map(([id, data]) => ({
          id,
          name: data.name,
          amount: data.amount,
          percentage: totalExpensesForCategories > 0 ? Math.round((data.amount / totalExpensesForCategories) * 100) : 0,
          color: data.color,
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3);

      set({
        totalBalance: balance,
        monthlyIncome: income,
        monthlyExpense: expense,
        topCategories: sortedCategories,
        recentTransactions: recentTxRes.data || [],
        accounts: fetchedAccounts,
        isLoading: false,
      });
    } catch (error) {
      set({ error: `Error loading dashboard data.\n${JSON.stringify(error)}`, isLoading: false });
    }
  },
}));
