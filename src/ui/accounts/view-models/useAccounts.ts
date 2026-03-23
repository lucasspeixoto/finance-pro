import { accountsRepository } from '@/src/data/repositories/accounts/accounts-repository';
import type { Account } from '@/src/domain/models/accounts/account.model';
import { useAlertBoxStore } from '@/src/shared/hooks/use-alert-box';
import { useLoadingStore } from '@/src/shared/hooks/use-loading';
import { useDashboardStore } from '@/src/ui/dashboard/stores/dashboard-store';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { mapPostgresError } from '@/src/utils/errors';

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const { setIsLoading } = useLoadingStore();
  const { setMessage, setIsVisible } = useAlertBoxStore();
  const { fetchDashboardData } = useDashboardStore();

  const fetchAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await accountsRepository.getAll();
      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      setMessage(`Erro ao carregar contas!\n${mapPostgresError(error)}`);
      setIsVisible(true);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setMessage, setIsVisible]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const sortedAccounts = useMemo(() => {
    return [...accounts].sort((a, b) => b.balance - a.balance);
  }, [accounts]);

  const deleteAccount = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await accountsRepository.delete(id);
      if (error) throw error;
      
      setAccounts(prev => prev.filter(a => a.id !== id));
      fetchDashboardData(); // Sync dashboard
    } catch (error) {
      setMessage(`Erro ao excluir conta!\n${mapPostgresError(error)}`);
      setIsVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAccount = (id: string) => {
    router.push({ pathname: '/(modals)/add-account', params: { id } });
  };

  const handleAddAccount = () => {
    router.push('/(modals)/add-account');
  };

  return {
    accounts: sortedAccounts,
    deleteAccount,
    handleEditAccount,
    handleAddAccount,
    refreshAccounts: fetchAccounts,
  };
}
