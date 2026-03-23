import { accountsRepository } from '@/src/data/repositories/accounts/accounts-repository';
import { categoriesRepository } from '@/src/data/repositories/categories/categories-repository';
import { transactionsRepository } from '@/src/data/repositories/transactions/transactions-repository';
import type { Account } from '@/src/domain/models/accounts/account.model';
import type { Category } from '@/src/domain/models/categories/category.model';
import type { TransactionType } from '@/src/domain/models/transactions/transaction.model';
import { useAuth } from '@/src/ui/auth/view-models/useAuth';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useAlertBoxStore } from '../../../shared/hooks/use-alert-box';
import { useLoadingStore } from '../../../shared/hooks/use-loading';
import { useDashboardStore } from '../../dashboard/stores/dashboard-store';
import { useHistoryStore } from '../../history/stores/history-store';

export function useAddTransaction() {
  const { user } = useAuth();
  const { setIsLoading } = useLoadingStore();
  const { setMessage, setIsVisible } = useAlertBoxStore();
  const { fetchDashboardData } = useDashboardStore();

  const [type, setType] = useState<TransactionType>('expense');
  const [amountInput, setAmountInput] = useState<string>('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isPaid, setIsPaid] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, accsRes] = await Promise.all([
          categoriesRepository.getAll(),
          accountsRepository.getAll()
        ]);

        if (catsRes.error) throw new Error(catsRes.error.message);
        if (accsRes.error) throw new Error(accsRes.error.message);

        const fetchedCategories = catsRes.data || [];
        setCategories(fetchedCategories);
        setAccounts(accsRes.data || []);

        setSelectedCategoryId(fetchedCategories.find(c => c.type === 'expense')?.id || null);
      } catch (error) {
        setMessage('Erro ao carregar dados iniciais.\n' + JSON.stringify(error));
        setIsVisible(true);
      }
    };
    fetchData();
  }, []);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      setMessage('Usuário não autenticado.');
      setIsVisible(true);
      return;
    }

    if (!amountInput || amountInput === '0,00' || amountInput === '0') {
      setMessage('Insira um valor válido.');
      setIsVisible(true);
      return;
    }

    if (!selectedAccountId) {
      setMessage('Selecione uma conta.');
      setIsVisible(true);
      return;
    }

    if (type !== 'transfer' && !selectedCategoryId) {
      setMessage('Selecione uma categoria.');
      setIsVisible(true);
      return;
    }

    // Convert '1.200,50' or '1200.50' to number
    const normalizedAmount = parseFloat(amountInput.replace(/\./g, '').replace(',', '.'));

    if (isNaN(normalizedAmount) || normalizedAmount <= 0) {
      setMessage('Valor inválido.');
      setIsVisible(true);
      return;
    }

    try {
      setIsLoading(true);

      const newTransaction = {
        user_id: user.id,
        account_id: selectedAccountId,
        category_id: type === 'transfer' ? null : selectedCategoryId,
        type,
        amount: normalizedAmount,
        description: description || null,
        date: date.toISOString().split('T')[0],
        is_paid: isPaid,
        notes: null
      };

      const { error } = await transactionsRepository.create(newTransaction);

      if (error) throw new Error(error.message);

      // Refresh Dashboard Data
      await fetchDashboardData();
      
      // Refresh History Data
      const { data: historyData } = await transactionsRepository.getRecent(100);
      if (historyData) {
        useHistoryStore.getState().setTransactions(historyData);
      }

      setMessage('Transação salva com sucesso!');
      setIsVisible(true);

      // Navigate back
      router.back();

    } catch (error) {
      setMessage('Erro ao salvar transação.\n' + JSON.stringify(error));
      setIsVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    type,
    setType,
    amountInput,
    setAmountInput,
    description,
    setDescription,
    date,
    setDate,
    showDatePicker,
    setShowDatePicker,
    handleDateChange,
    isPaid,
    setIsPaid,
    categories,
    accounts,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedAccountId,
    setSelectedAccountId,
    handleSave
  };
}
