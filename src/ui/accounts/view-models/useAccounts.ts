import { accountsRepository } from '@/src/data/repositories/accounts/accounts-repository';
import type { Account, AccountType } from '@/src/domain/models/accounts/account.model';
import { useAlertBoxStore } from '@/src/shared/hooks/use-alert-box';
import { useLoadingStore } from '@/src/shared/hooks/use-loading';
import { useDashboardStore } from '@/src/ui/dashboard/stores/dashboard-store';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { mapPostgresError } from '@/src/utils/errors';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '@/src/ui/auth/view-models/useAuth';

export function useAccounts(id?: string) {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const { setIsLoading } = useLoadingStore();
  const { setMessage, setIsVisible } = useAlertBoxStore();
  const { fetchDashboardData } = useDashboardStore();

  // Form States
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('checking');
  const [amountInput, setAmountInput] = useState('');
  const [color, setColor] = useState('#006239'); // Default emerald
  const [icon, setIcon] = useState('account-balance');

  const fetchAccounts = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const { data, error } = await accountsRepository.getAll();
      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      setMessage(`Erro ao carregar contas!\n${mapPostgresError(error)}`);
      setIsVisible(true);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [setIsLoading, setMessage, setIsVisible]);

  const fetchAccount = useCallback(async (accountId: string, showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const { data, error } = await accountsRepository.getById(accountId);
      if (error) throw error;
      if (data) {
        setName(data.name);
        setType(data.type);
        setAmountInput(data.balance.toString());
        setColor(data.color || '#006239');
        setIcon(data.icon || 'account-balance');
      }
    } catch (error) {
      setMessage(`Erro ao carregar conta!\n${mapPostgresError(error)}`);
      setIsVisible(true);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [setIsLoading, setMessage, setIsVisible]);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        fetchAccount(id, true); // Keep loading for initial modal open
      } else {
        fetchAccounts(false); // Background refresh for list
      }
    }, [id, fetchAccounts, fetchAccount])
  );

  const sortedAccounts = useMemo(() => {
    return [...accounts].sort((a, b) => b.balance - a.balance);
  }, [accounts]);

  const deleteAccount = async (idToDelete: string) => {
    try {
      setIsLoading(true);
      const { error } = await accountsRepository.delete(idToDelete);
      if (error) throw error;
      
      setAccounts(prev => prev.filter(a => a.id !== idToDelete));
      fetchDashboardData(); // Sync dashboard
    } catch (error) {
      setMessage(`Erro ao excluir conta!\n${mapPostgresError(error)}`);
      setIsVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAccount = async () => {
    if (!name.trim()) {
      setMessage('O nome da conta é obrigatório!');
      setIsVisible(true);
      return;
    }

    const balance = parseFloat(amountInput.replace(',', '.')) || 0;

    try {
      setIsLoading(true);
      if (id) {
        const { error } = await accountsRepository.update(id, {
          name,
          type,
          balance,
          color,
          icon,
        });
        if (error) throw error;
      } else {
        if (!user?.id) throw new Error('Usuário não autenticado');
        const { error } = await accountsRepository.create({
          name,
          type,
          balance,
          color,
          icon,
          user_id: user.id,
          is_active: true,
        });
        if (error) throw error;
      }

      setIsLoading(false);
      fetchDashboardData();
      router.back();
    } catch (error) {
      setIsLoading(false);
      const action = id ? 'atualizar' : 'criar';
      setMessage(`Erro ao ${action} conta!\n${mapPostgresError(error)}`);
      setIsVisible(true);
    }
  };

  const handleEditAccount = (accountId: string) => {
    router.push({ pathname: '/(modals)/add-account', params: { id: accountId } });
  };

  const handleAddAccount = () => {
    router.push('/(modals)/add-account');
  };

  return {
    accounts: sortedAccounts,
    name,
    setName,
    type,
    setType,
    amountInput,
    setAmountInput,
    color,
    setColor,
    icon,
    setIcon,
    deleteAccount,
    handleSaveAccount,
    handleEditAccount,
    handleAddAccount,
    refreshAccounts: fetchAccounts,
  };
}
