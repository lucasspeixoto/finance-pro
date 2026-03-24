import type { Category } from '@/src/domain/models/categories/category.model';
import { supabase } from '@/src/utils/supabase';

class CategoriesService {
  async getAll(): Promise<{ data: Category[] | null; error: any }> {
    return await supabase.from('categories').select('*');
  }

  async getById(id: string): Promise<{ data: Category | null; error: any }> {
    return await supabase.from('categories').select('*').eq('id', id).single();
  }

  async delete(id: string): Promise<{ error: any }> {
    return await supabase.from('categories').delete().eq('id', id);
  }

  async update(id: string, category: Partial<Category>): Promise<{ data: Category | null; error: any }> {
    return await supabase.from('categories').update(category).eq('id', id).select().single();
  }

  async create(category: Omit<Category, 'id' | 'created_at'>): Promise<{ data: Category | null; error: any }> {
    return await supabase.from('categories').insert(category).select().single();
  }
}

export const categoriesService = new CategoriesService();
