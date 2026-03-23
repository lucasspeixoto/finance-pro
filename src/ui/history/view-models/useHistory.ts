import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/src/core/theme/theme.hooks';
import { useHistoryStore } from '@/src/ui/history/stores/history-store';
import { useDashboardStore } from '@/src/ui/dashboard/stores/dashboard-store';

export function useHistory() {
  const { colors, isDark } = useTheme();
  const {
    transactions,
    filteredTransactions,
    isLoading,
    error,
    fetchTransactions,
    setSearchQuery,
    searchQuery,
    deleteTransaction,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedAccountId,
    setSelectedAccountId,
    selectedDate,
    setSelectedDate
  } = useHistoryStore();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const { accounts } = useDashboardStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearchQuery);
    }, 400);

    return () => clearTimeout(handler);
  }, [localSearchQuery, setSearchQuery]);

  const categories = useMemo(() => {
    const uniqueCats = new Map();
    transactions.forEach(t => {
      if (t.categories) {
        uniqueCats.set(t.categories.id, t.categories);
      }
    });
    return Array.from(uniqueCats.values());
  }, [transactions]);

  const accountsFilterList = useMemo(() => {
    const uniqueAccs = new Map();
    transactions.forEach(t => {
      if (t.accounts) {
        uniqueAccs.set(t.accounts.id, t.accounts);
      }
    });
    return Array.from(uniqueAccs.values());
  }, [transactions]);

  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: typeof filteredTransactions } = {};
    const now = new Date();
    const todayStr = now.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString('pt-BR', { timeZone: 'UTC' });

    filteredTransactions.forEach(tx => {
      const date = new Date(tx.date);
      const dateStr = date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });

      let title = dateStr;
      if (dateStr === todayStr) title = 'Hoje';
      else if (dateStr === yesterdayStr) title = 'Ontem';
      else title = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', timeZone: 'UTC' });

      if (!groups[title]) groups[title] = [];
      groups[title].push(tx);
    });

    return Object.entries(groups).map(([title, data]) => ({ title, data }));
  }, [filteredTransactions]);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const selectedAccount = accountsFilterList.find(a => a.id === selectedAccountId);

  return {
    colors,
    isDark,
    filteredTransactions,
    isLoading,
    error,
    searchQuery,
    localSearchQuery,
    setLocalSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedAccountId,
    setSelectedAccountId,
    selectedDate,
    setSelectedDate,
    showDatePicker,
    setShowDatePicker,
    showCategoryPicker,
    setShowCategoryPicker,
    showAccountPicker,
    setShowAccountPicker,
    categories,
    accountsFilterList,
    groupedTransactions,
    selectedCategory,
    selectedAccount,
    deleteTransaction
  };
}
