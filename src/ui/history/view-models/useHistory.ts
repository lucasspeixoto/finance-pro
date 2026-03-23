import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '@/src/core/theme/theme.hooks';
import { useHistoryStore } from '@/src/ui/history/stores/history-store';
import { useDashboardStore } from '@/src/ui/dashboard/stores/dashboard-store';
import { transactionsRepository } from '@/src/data/repositories/transactions/transactions-repository';

export function useHistory() {
  const { colors, isDark } = useTheme();
  const {
    transactions,
    isLoading,
    error,
    searchQuery,
    selectedCategoryId,
    selectedAccountId,
    selectedDate,
    setTransactions,
    setLoading,
    setError,
    setSearchQuery,
    setSelectedCategoryId,
    setSelectedAccountId,
    setSelectedDate
  } = useHistoryStore();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  const { accounts, fetchDashboardData } = useDashboardStore();

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchErr } = await transactionsRepository.getRecent(100);
      if (fetchErr) throw fetchErr;
      setTransactions(data || []);
    } catch (err: any) {
      setError(`Erro ao carregar transações!\n ${JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  }, [setTransactions, setLoading, setError]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearchQuery);
    }, 400);

    return () => clearTimeout(handler);
  }, [localSearchQuery, setSearchQuery]);

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Filter by Month and Year
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    filtered = filtered.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getFullYear() === year && tDate.getMonth() === month;
    });

    // Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        (t.description?.toLowerCase().includes(query)) ||
        (t.categories?.name?.toLowerCase().includes(query))
      );
    }

    // Filter by Category
    if (selectedCategoryId) {
      filtered = filtered.filter(t => t.category_id === selectedCategoryId);
    }

    // Filter by Account
    if (selectedAccountId) {
      filtered = filtered.filter(t => t.account_id === selectedAccountId);
    }

    return filtered;
  }, [transactions, searchQuery, selectedCategoryId, selectedAccountId, selectedDate]);

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

  const handleDeletePress = (id: string) => {
    setTransactionToDelete(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (transactionToDelete) {
      try {
        const { error: delErr } = await transactionsRepository.delete(transactionToDelete);
        if (delErr) throw delErr;

        setTransactions(transactions.filter(t => t.id !== transactionToDelete));
        setTransactionToDelete(null);
        setShowConfirmDelete(false);
        
        // Refresh dashboard data to sync balances and recent transactions
        fetchDashboardData();
      } catch (err: any) {
        setError(`Erro ao deletar transação!\n ${JSON.stringify(err)}`);
      }
    }
  };

  const cancelDelete = () => {
    setTransactionToDelete(null);
    setShowConfirmDelete(false);
  };

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
    handleDeletePress,
    showConfirmDelete,
    setShowConfirmDelete,
    confirmDelete,
    cancelDelete
  };
}
