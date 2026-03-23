export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  category_id?: string | null;
  type: TransactionType;
  amount: number;
  description?: string | null;
  date: string;
  is_paid: boolean;
  notes?: string | null;
  created_at: string;
}
