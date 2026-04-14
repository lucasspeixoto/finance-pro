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

  it('should fetch all transactions', async () => {
    const mockData = [{ id: '1', ...mockTransaction }];
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const result = await transactionsService.getAll();

    expect(supabase.from).toHaveBeenCalledWith('transactions');
    expect(result.data).toEqual(mockData);
  });

  it('should fetch recent transactions', async () => {
    const mockData = [{ id: '1', ...mockTransaction, categories: { name: 'Food' }, accounts: { name: 'Cash' } }];
    const selectMock = jest.fn().mockReturnThis();
    (supabase.from as jest.Mock).mockReturnValue({
      select: selectMock,
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const result = await transactionsService.getRecent(5);

    expect(supabase.from).toHaveBeenCalledWith('transactions');
    expect(selectMock).toHaveBeenCalledWith('*, categories(*), accounts(*)');
    expect(result.data).toEqual(mockData);
  });

  it('should fetch transactions by date range', async () => {
    const mockData = [{ id: '1', ...mockTransaction, categories: { name: 'Food' }, accounts: { name: 'Cash' } }];
    const selectMock = jest.fn().mockReturnThis();
    (supabase.from as jest.Mock).mockReturnValue({
      select: selectMock,
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const result = await transactionsService.getByDateRange('2023-01-01', '2023-01-31');

    expect(supabase.from).toHaveBeenCalledWith('transactions');
    expect(selectMock).toHaveBeenCalledWith('*, categories(*), accounts(*)');
    expect(result.data).toEqual(mockData);
  });

  it('should create a transaction via RPC', async () => {
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: mockTransaction, error: null });

    const result = await transactionsService.create(mockTransaction);

    expect(supabase.rpc).toHaveBeenCalledWith(
      'create_transaction_and_update_balance',
      expect.objectContaining({
        p_amount: mockTransaction.amount,
        p_description: mockTransaction.description,
      }),
    );
    expect(result.data).toEqual(mockTransaction);
  });

  it('should update a transaction via RPC', async () => {
    const updateData = { description: 'Updated' };
    const updatedTransaction = { ...mockTransaction, ...updateData };

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockTransaction, error: null }),
    });
    (supabase.rpc as jest.Mock).mockResolvedValue({ data: updatedTransaction, error: null });

    const result = await transactionsService.update('1', updateData);

    expect(supabase.rpc).toHaveBeenCalledWith(
      'update_transaction_and_update_balance',
      expect.objectContaining({
        p_id: '1',
        p_description: 'Updated',
      }),
    );
    expect(result.data?.description).toBe('Updated');
  });

  it('should delete a transaction via RPC', async () => {
    (supabase.rpc as jest.Mock).mockResolvedValue({ error: null });

    const result = await transactionsService.delete('1');

    expect(supabase.rpc).toHaveBeenCalledWith('delete_transaction_and_update_balance', {
      p_id: '1',
    });
    expect(result.error).toBeNull();
  });
});
