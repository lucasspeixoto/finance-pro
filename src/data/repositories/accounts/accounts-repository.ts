import type { Account } from '@/src/domain/models/accounts/account.model';
import { accountsService } from '../../services/accounts/accounts-service';

class AccountsRepository {
  async getAll() {
    return await accountsService.getAll();
  }

  async getById(id: string) {
    return await accountsService.getById(id);
  }

  async delete(id: string) {
    return await accountsService.delete(id);
  }

  async create(account: Omit<Account, 'id' | 'created_at'>) {
    return await accountsService.create(account);
  }

  async update(id: string, account: Partial<Account>) {
    return await accountsService.update(id, account);
  }

  async transferBalance(fromAccountId: string, toAccountId: string, amount: number) {
    return await accountsService.transferBalance(fromAccountId, toAccountId, amount);
  }
}

export const accountsRepository = new AccountsRepository();
