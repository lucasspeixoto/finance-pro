import type { TransactionWithCategory } from '@/src/data/services/transactions/transactions-service';
import { create } from 'zustand';

interface HistoryState {
  transactions: TransactionWithCategory[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategoryId: string | null;
  selectedAccountId: string | null;
  selectedDate: Date;

  setTransactions: (transactions: TransactionWithCategory[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategoryId: (id: string | null) => void;
  setSelectedAccountId: (id: string | null) => void;
  setSelectedDate: (date: Date) => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  transactions: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCategoryId: null,
  selectedAccountId: null,
  selectedDate: new Date(),

  setTransactions: (transactions) => set({ transactions }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
  setSelectedAccountId: (id) => set({ selectedAccountId: id }),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
