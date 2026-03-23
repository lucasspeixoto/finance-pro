import type { Account } from '@/src/domain/models/accounts/account.model';
import { supabase } from '@/src/utils/supabase';

class AccountsService {
  async getAll(): Promise<{ data: Account[] | null; error: any }> {
    return await supabase.from('accounts').select('*').order('created_at', { ascending: false });
  }

  async getById(id: string): Promise<{ data: Account | null; error: any }> {
    return await supabase.from('accounts').select('*').eq('id', id).single();
  }

  async delete(id: string): Promise<{ error: any }> {
    return await supabase.from('accounts').delete().eq('id', id);
  }

  async update(id: string, account: Partial<Account>): Promise<{ data: Account | null; error: any }> {
    return await supabase.from('accounts').update(account).eq('id', id).select().single();
  }
}

export const accountsService = new AccountsService();
