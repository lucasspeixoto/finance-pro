import { transactionsService } from '../transactions-service';
import { supabase } from '@/src/utils/supabase';

describe('TransactionsService', () => {
  const mockTransaction = {
    amount: 100,
    description: 'Test Transaction',
    date: '2023-01-01',
    account_id: 'acc-123',
    category_id: 'cat-123',
    type: 'expense' as const,
    user_id: 'user-123',
    is_paid: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all transactions with categories', async () => {
    const mockData = [{ id: '1', ...mockTransaction, categories: { name: 'Food' } }];
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const result = await transactionsService.getAll();

    expect(supabase.from).toHaveBeenCalledWith('transactions');
    expect(result.data).toEqual(mockData);
  });

  it('should fetch recent transactions', async () => {
    const mockData = [{ id: '1', ...mockTransaction }];
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const result = await transactionsService.getRecent(5);

    expect(supabase.from).toHaveBeenCalledWith('transactions');
    expect(result.data).toEqual(mockData);
  });

  it('should fetch transactions by date range', async () => {
    const mockData = [{ id: '1', ...mockTransaction }];
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const result = await transactionsService.getByDateRange('2023-01-01', '2023-01-31');

    expect(supabase.from).toHaveBeenCalledWith('transactions');
    expect(result.data).toEqual(mockData);
  });

  it('should create a transaction', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockTransaction, error: null }),
    });

    const result = await transactionsService.create(mockTransaction);

    expect(supabase.from).toHaveBeenCalledWith('transactions');
    expect(result.data).toEqual(mockTransaction);
  });

  it('should update a transaction', async () => {
    const updateData = { description: 'Updated' };
    (supabase.from as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { ...mockTransaction, ...updateData }, error: null }),
    });

    const result = await transactionsService.update('1', updateData);

    expect(supabase.from).toHaveBeenCalledWith('transactions');
    expect(result.data?.description).toBe('Updated');
  });

  it('should delete a transaction', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    });

    const result = await transactionsService.delete('1');

    expect(supabase.from).toHaveBeenCalledWith('transactions');
    expect(result.error).toBeNull();
  });
});
