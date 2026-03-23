import type { Account } from '@/src/domain/models/accounts/account.model';
import type { Category } from '@/src/domain/models/categories/category.model';
import type { Transaction } from '@/src/domain/models/transactions/transaction.model';
import { supabase } from '@/src/utils/supabase';

export type TransactionWithCategory = Transaction & { 
  categories: Category | null;
  accounts: Account | null;
};

class TransactionsService {
  async getAll(): Promise<{ data: Transaction[] | null; error: any }> {
    return await supabase.from('transactions').select('*').order('date', { ascending: false });
  }

  async getRecent(limit: number): Promise<{ data: TransactionWithCategory[] | null; error: any }> {
    return await supabase
      .from('transactions')
      .select('*, categories(*), accounts(*)')
      .order('date', { ascending: false })
      .limit(limit);
  }

  async getById(id: string): Promise<{ data: TransactionWithCategory | null; error: any }> {
    return await supabase
      .from('transactions')
      .select('*, categories(*), accounts(*)')
      .eq('id', id)
      .single();
  }

  async getByDateRange(startDate: string, endDate: string): Promise<{ data: TransactionWithCategory[] | null; error: any }> {
    return await supabase
      .from('transactions')
      .select('*, categories(*), accounts(*)')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });
  }

  async create(transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<{ data: Transaction | null; error: any }> {
    return await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();
  }

  async update(id: string, transaction: Partial<Transaction>): Promise<{ data: Transaction | null; error: any }> {
    return await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .select()
      .single();
  }

  async delete(id: string): Promise<{ error: any }> {
    return await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
  }
}

export const transactionsService = new TransactionsService();
