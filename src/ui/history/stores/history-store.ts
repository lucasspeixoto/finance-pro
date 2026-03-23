import { transactionsRepository } from '@/src/data/repositories/transactions/transactions-repository';
import type { TransactionWithCategory } from '@/src/data/services/transactions/transactions-service';
import { create } from 'zustand';

interface HistoryState {
  transactions: TransactionWithCategory[];
  filteredTransactions: TransactionWithCategory[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategoryId: string | null;
  selectedAccountId: string | null;
  selectedDate: Date;

  fetchTransactions: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedCategoryId: (id: string | null) => void;
  setSelectedAccountId: (id: string | null) => void;
  setSelectedDate: (date: Date) => void;
  deleteTransaction: (id: string) => Promise<void>;
  applyFilters: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  transactions: [],
  filteredTransactions: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCategoryId: null,
  selectedAccountId: null,
  selectedDate: new Date(),

  fetchTransactions: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await transactionsRepository.getRecent(100);
      if (error) throw error;

      set({ transactions: data || [], isLoading: false });
      get().applyFilters();
    } catch (error) {
      set({ error: `Erro ao carregar transações!\n ${JSON.stringify(error)}`, isLoading: false });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  setSelectedCategoryId: (id: string | null) => {
    set({ selectedCategoryId: id });
    get().applyFilters();
  },

  setSelectedAccountId: (id: string | null) => {
    set({ selectedAccountId: id });
    get().applyFilters();
  },

  setSelectedDate: (date: Date) => {
    set({ selectedDate: date });
    get().applyFilters();
  },

  deleteTransaction: async (id: string) => {
    try {
      const { error } = await transactionsRepository.delete(id);
      if (error) throw error;

      set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id),
      }));
      get().applyFilters();
    } catch (error) {
      set({ error: `Erro ao deletar transação!\n ${JSON.stringify(error)}` });
    }
  },

  applyFilters: () => {
    const { transactions, searchQuery, selectedCategoryId, selectedAccountId, selectedDate } = get();

    let filtered = [...transactions];

    // Filter by Month and Year
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    filtered = filtered.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getFullYear() === year && tDate.getMonth() === month;
    });

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        (t.description?.toLowerCase().includes(query)) ||
        (t.categories?.name?.toLowerCase().includes(query))
      );
    }

    if (selectedCategoryId) {
      filtered = filtered.filter(t => t.category_id === selectedCategoryId);
    }

    if (selectedAccountId) {
      filtered = filtered.filter(t => t.account_id === selectedAccountId);
    }

    set({ filteredTransactions: filtered });
  }
}));
