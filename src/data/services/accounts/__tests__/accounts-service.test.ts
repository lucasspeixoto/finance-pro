import { accountsService } from '../accounts-service';
import { supabase } from '@/src/utils/supabase';

describe('AccountsService', () => {
  const mockAccount = {
    name: 'Test Account',
    balance: 1000,
    type: 'checking' as const,
    color: '#000000',
    icon: 'home',
    user_id: 'user-123',
    is_active: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all accounts', async () => {
    const mockData = [{ id: '1', ...mockAccount }];
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const result = await accountsService.getAll();

    expect(supabase.from).toHaveBeenCalledWith('accounts');
    expect(result.data).toEqual(mockData);
  });

  it('should fetch account by id', async () => {
    const mockData = { id: '1', ...mockAccount };
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const result = await accountsService.getById('1');

    expect(supabase.from).toHaveBeenCalledWith('accounts');
    expect(result.data).toEqual(mockData);
  });

  it('should create an account', async () => {
    const mockData = { id: '1', ...mockAccount };
    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const result = await accountsService.create(mockAccount);

    expect(supabase.from).toHaveBeenCalledWith('accounts');
    expect(result.data).toEqual(mockData);
  });

  it('should update an account', async () => {
    const updateData = { name: 'Updated Name' };
    const mockData = { id: '1', ...mockAccount, ...updateData };
    (supabase.from as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const result = await accountsService.update('1', updateData);

    expect(supabase.from).toHaveBeenCalledWith('accounts');
    expect(result.data).toEqual(mockData);
  });

  it('should delete an account', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    });

    const result = await accountsService.delete('1');

    expect(supabase.from).toHaveBeenCalledWith('accounts');
    expect(result.error).toBeNull();
  });
});
