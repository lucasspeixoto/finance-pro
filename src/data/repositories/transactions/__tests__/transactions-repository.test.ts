import { transactionsRepository } from '../transactions-repository';
import { transactionsService } from '@/src/data/services/transactions/transactions-service';

jest.mock('@/src/data/services/transactions/transactions-service');

describe('TransactionsRepository', () => {
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

  it('should call transactionsService.getAll', async () => {
    const mockData = [{ id: '1', ...mockTransaction, created_at: new Date().toISOString() }];
    (transactionsService.getAll as jest.Mock).mockResolvedValue({ data: mockData, error: null });

    const result = await transactionsRepository.getAll();

    expect(transactionsService.getAll).toHaveBeenCalled();
    expect(result.data).toEqual(mockData);
  });

  it('should call transactionsService.getRecent', async () => {
    const mockData = [{ id: '1', ...mockTransaction, created_at: new Date().toISOString() }];
    (transactionsService.getRecent as jest.Mock).mockResolvedValue({ data: mockData, error: null });

    const result = await transactionsRepository.getRecent(5);

    expect(transactionsService.getRecent).toHaveBeenCalledWith(5);
    expect(result.data).toEqual(mockData);
  });

  it('should call transactionsService.getById', async () => {
    const mockData = { id: '1', ...mockTransaction, created_at: new Date().toISOString() };
    (transactionsService.getById as jest.Mock).mockResolvedValue({ data: mockData, error: null });

    const result = await transactionsRepository.getById('1');

    expect(transactionsService.getById).toHaveBeenCalledWith('1');
    expect(result.data).toEqual(mockData);
  });

  it('should call transactionsService.getByDateRange', async () => {
    const mockData = [{ id: '1', ...mockTransaction, created_at: new Date().toISOString() }];
    (transactionsService.getByDateRange as jest.Mock).mockResolvedValue({ data: mockData, error: null });

    const result = await transactionsRepository.getByDateRange('2023-01-01', '2023-01-31');

    expect(transactionsService.getByDateRange).toHaveBeenCalledWith('2023-01-01', '2023-01-31');
    expect(result.data).toEqual(mockData);
  });

  it('should call transactionsService.create', async () => {
    (transactionsService.create as jest.Mock).mockResolvedValue({ error: null });

    await transactionsRepository.create(mockTransaction);

    expect(transactionsService.create).toHaveBeenCalledWith(mockTransaction);
  });

  it('should call transactionsService.update', async () => {
    const updateData = { description: 'Updated' };
    (transactionsService.update as jest.Mock).mockResolvedValue({ error: null });

    await transactionsRepository.update('1', updateData);

    expect(transactionsService.update).toHaveBeenCalledWith('1', updateData);
  });

  it('should call transactionsService.delete', async () => {
    (transactionsService.delete as jest.Mock).mockResolvedValue({ error: null });

    await transactionsRepository.delete('1');

    expect(transactionsService.delete).toHaveBeenCalledWith('1');
  });
});
