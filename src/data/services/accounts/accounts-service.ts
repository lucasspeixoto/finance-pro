import type { Account } from '@/src/domain/models/accounts/account.model';
import { supabase } from '@/src/utils/supabase';
import type { PostgrestError } from '@supabase/supabase-js';

class AccountsService {
  async getAll(): Promise<{ data: Account[] | null; error: PostgrestError | null }> {
    return await supabase.from('accounts').select('*').order('created_at', { ascending: false });
  }

  async getById(id: string): Promise<{ data: Account | null; error: PostgrestError | null }> {
    return await supabase.from('accounts').select('*').eq('id', id).single();
  }

  async delete(id: string): Promise<{ error: PostgrestError | null }> {
    return await supabase.from('accounts').delete().eq('id', id);
  }

  async create(
    account: Omit<Account, 'id' | 'created_at'>,
  ): Promise<{ data: Account | null; error: PostgrestError | null }> {
    return await supabase.from('accounts').insert(account).select().single();
  }

  async update(id: string, account: Partial<Account>): Promise<{ data: Account | null; error: PostgrestError | null }> {
    return await supabase.from('accounts').update(account).eq('id', id).select().single();
  }
}

export const accountsService = new AccountsService();
