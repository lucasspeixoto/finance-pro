export type AccountType = 'checking' | 'savings' | 'cash' | 'investment' | 'credit_card';

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  balance: number;
  color?: string | null;
  icon?: string | null;
  is_active: boolean;
  created_at: string;
}
