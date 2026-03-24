import { accountsRepository } from '../accounts-repository';
import { accountsService } from '@/src/data/services/accounts/accounts-service';

jest.mock('@/src/data/services/accounts/accounts-service');

describe('AccountsRepository', () => {
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

  it('should call accountsService.getAll', async () => {
    const mockData = [{ id: '1', ...mockAccount, created_at: new Date().toISOString() }];
    (accountsService.getAll as jest.Mock).mockResolvedValue({ data: mockData, error: null });

    const result = await accountsRepository.getAll();

    expect(accountsService.getAll).toHaveBeenCalled();
    expect(result.data).toEqual(mockData);
  });

  it('should call accountsService.getById', async () => {
    const mockData = { id: '1', ...mockAccount, created_at: new Date().toISOString() };
    (accountsService.getById as jest.Mock).mockResolvedValue({ data: mockData, error: null });

    const result = await accountsRepository.getById('1');

    expect(accountsService.getById).toHaveBeenCalledWith('1');
    expect(result.data).toEqual(mockData);
  });

  it('should call accountsService.create', async () => {
    (accountsService.create as jest.Mock).mockResolvedValue({ error: null });

    await accountsRepository.create(mockAccount);

    expect(accountsService.create).toHaveBeenCalledWith(mockAccount);
  });

  it('should call accountsService.update', async () => {
    const updateData = { name: 'Updated' };
    (accountsService.update as jest.Mock).mockResolvedValue({ error: null });

    await accountsRepository.update('1', updateData);

    expect(accountsService.update).toHaveBeenCalledWith('1', updateData);
  });

  it('should call accountsService.delete', async () => {
    (accountsService.delete as jest.Mock).mockResolvedValue({ error: null });

    await accountsRepository.delete('1');

    expect(accountsService.delete).toHaveBeenCalledWith('1');
  });
});
