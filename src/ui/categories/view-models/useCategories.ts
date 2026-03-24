import { categoriesRepository } from '@/src/data/repositories/categories/categories-repository';
import type { Category, CategoryType } from '@/src/domain/models/categories/category.model';
import { useAlertBoxStore } from '@/src/shared/hooks/use-alert-box';
import { useLoadingStore } from '@/src/shared/hooks/use-loading';
import { useAuth } from '@/src/ui/auth/view-models/useAuth';
import { useDashboardStore } from '@/src/ui/dashboard/stores/dashboard-store';
import { mapPostgresError } from '@/src/utils/errors';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';

export function useCategories(id?: string) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const { setIsLoading } = useLoadingStore();
  const { setMessage, setIsVisible } = useAlertBoxStore();
  const { fetchDashboardData } = useDashboardStore();

  // Form States
  const [name, setName] = useState('');
  const [type, setType] = useState<CategoryType>('expense');
  const [color, setColor] = useState('#006239'); // Default emerald
  const [icon, setIcon] = useState('category');

  const fetchCategories = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const { data, error } = await categoriesRepository.getAll();
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      setMessage(`Erro ao carregar categorias!\n${mapPostgresError(error)}`);
      setIsVisible(true);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [setIsLoading, setMessage, setIsVisible]);

  const fetchCategory = useCallback(async (categoryId: string, showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const { data, error } = await categoriesRepository.getById(categoryId);
      if (error) throw error;
      if (data) {
        setName(data.name);
        setType(data.type);
        setColor(data.color || '#006239');
        setIcon(data.icon || 'category');
      }
    } catch (error) {
      setMessage(`Erro ao carregar categoria!\n${mapPostgresError(error)}`);
      setIsVisible(true);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [setIsLoading, setMessage, setIsVisible]);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        fetchCategory(id, true); // Keep loading for initial modal open
      } else {
        fetchCategories(false); // Background refresh for list
      }
    }, [id, fetchCategories, fetchCategory])
  );

  const deleteCategory = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await categoriesRepository.delete(id);
      if (error) throw error;

      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      setMessage(`Erro ao excluir categoria!\n${mapPostgresError(error)}`);
      setIsVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = (id: string) => {
    router.push({ pathname: '/(modals)/add-category', params: { id } });
  };

  const handleAddCategory = () => {
    router.push('/(modals)/add-category');
  };

  const handleSaveCategory = async () => {
    if (!name.trim()) {
      setMessage('O nome da categoria é obrigatório!');
      setIsVisible(true);
      return;
    }

    try {
      setIsLoading(true);
      if (id) {
        const { error } = await categoriesRepository.update(id, {
          name,
          type,
          color,
          icon,
        });
        if (error) throw error;
      } else {
        if (!user?.id) throw new Error('Usuário não autenticado');
        const { error } = await categoriesRepository.create({
          name,
          type,
          color,
          icon,
          user_id: user.id,
          is_default: false,
        });
        if (error) throw error;
      }

      setIsLoading(false);
      fetchDashboardData();
      router.back();
    } catch (error) {
      setIsLoading(false);
      const action = id ? 'atualizar' : 'criar';
      setMessage(`Erro ao ${action} categoria!\n${mapPostgresError(error)}`);
      setIsVisible(true);
    }
  };

  return {
    categories,
    name,
    setName,
    type,
    setType,
    color,
    setColor,
    icon,
    setIcon,
    deleteCategory,
    handleSaveCategory,
    handleEditCategory,
    handleAddCategory,
    refreshCategories: fetchCategories,
  };
}
