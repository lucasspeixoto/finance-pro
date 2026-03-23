import { categoriesRepository } from '@/src/data/repositories/categories/categories-repository';
import type { Category } from '@/src/domain/models/categories/category.model';
import { useAlertBoxStore } from '@/src/shared/hooks/use-alert-box';
import { useLoadingStore } from '@/src/shared/hooks/use-loading';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { mapPostgresError } from '@/src/utils/errors';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { setIsLoading } = useLoadingStore();
  const { setMessage, setIsVisible } = useAlertBoxStore();

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await categoriesRepository.getAll();
      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      setMessage(`Erro ao carregar categorias!\n${mapPostgresError(error)}`);
      setIsVisible(true);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setMessage, setIsVisible]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

  return {
    categories,
    deleteCategory,
    handleEditCategory,
    handleAddCategory,
    refreshCategories: fetchCategories,
  };
}
