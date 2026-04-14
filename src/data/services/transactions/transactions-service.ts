import type { Account } from '@/src/domain/models/accounts/account.model';
import type { Category } from '@/src/domain/models/categories/category.model';
import type { Transaction } from '@/src/domain/models/transactions/transaction.model';
import { supabase } from '@/src/utils/supabase';
import type { PostgrestError } from '@supabase/supabase-js';

export type TransactionWithCategory = Transaction & {
  categories: Category | null;
  accounts: Account | null;
};

class TransactionsService {
  async getAll(): Promise<{ data: Transaction[] | null; error: PostgrestError | null }> {
    return await supabase.from('transactions').select('*').order('date', { ascending: false });
  }

  async getRecent(limit: number): Promise<{ data: TransactionWithCategory[] | null; error: PostgrestError | null }> {
    return await supabase
      .from('transactions')
      .select('*, categories(*), accounts(*)')
      .order('date', { ascending: false })
      .limit(limit);
  }

  async getById(id: string): Promise<{ data: TransactionWithCategory | null; error: PostgrestError | null }> {
    return await supabase.from('transactions').select('*, categories(*), accounts(*)').eq('id', id).single();
  }

  async getByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<{ data: TransactionWithCategory[] | null; error: PostgrestError | null }> {
    return await supabase
      .from('transactions')
      .select('*, categories(*), accounts(*)')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });
  }

  async create(
    transaction: Omit<Transaction, 'id' | 'created_at'>,
  ): Promise<{ data: Transaction | null; error: PostgrestError | null }> {
    const { data, error } = await supabase.rpc('create_transaction_and_update_balance', {
      p_user_id: transaction.user_id,
      p_account_id: transaction.account_id,
      p_category_id: transaction.category_id ?? null,
      p_type: transaction.type,
      p_amount: transaction.amount,
      p_description: transaction.description ?? null,
      p_date: transaction.date,
      p_is_paid: transaction.is_paid,
      p_notes: transaction.notes ?? null,
    });

    return { data: data as Transaction | null, error };
  }

  async update(
    id: string,
    transaction: Partial<Transaction>,
  ): Promise<{ data: Transaction | null; error: PostgrestError | null }> {
    // Fetch current state to fill in any fields not being updated
    const { data: current, error: fetchError } = await supabase.from('transactions').select('*').eq('id', id).single();

    if (fetchError || !current) {
      return { data: null, error: fetchError };
    }

    const merged = { ...current, ...transaction };

    const { data, error } = await supabase.rpc('update_transaction_and_update_balance', {
      p_id: id,
      p_account_id: merged.account_id,
      p_category_id: merged.category_id ?? null,
      p_type: merged.type,
      p_amount: merged.amount,
      p_description: merged.description ?? null,
      p_date: merged.date,
      p_is_paid: merged.is_paid,
      p_notes: merged.notes ?? null,
    });

    return { data: data as Transaction | null, error };
  }

  async delete(id: string): Promise<{ error: PostgrestError | null }> {
    const { error } = await supabase.rpc('delete_transaction_and_update_balance', {
      p_id: id,
    });

    return { error };
  }
}

export const transactionsService = new TransactionsService();
