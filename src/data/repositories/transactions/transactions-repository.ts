import type { Transaction } from '@/src/domain/models/transactions/transaction.model';
import { transactionsService, type TransactionWithCategory } from '../../services/transactions/transactions-service';

class TransactionsRepository {
  async getAll() {
    return await transactionsService.getAll();
  }

  async getRecent(limit: number = 3) {
    return await transactionsService.getRecent(limit);
  }

  async getByDateRange(startDate: string, endDate: string) {
    return await transactionsService.getByDateRange(startDate, endDate);
  }

  async create(transaction: Omit<Transaction, 'id' | 'created_at'>) {
    return await transactionsService.create(transaction);
  }
}

export const transactionsRepository = new TransactionsRepository();
