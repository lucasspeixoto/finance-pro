import { renderHook, act } from '@testing-library/react-native';
import { useAccounts } from '../useAccounts';
import { accountsRepository } from '@/src/data/repositories/accounts/accounts-repository';
import { useAuth } from '@/src/ui/auth/view-models/useAuth';
import { useLoadingStore } from '@/src/shared/hooks/use-loading';
import { useAlertBoxStore } from '@/src/shared/hooks/use-alert-box';
import { useDashboardStore } from '@/src/ui/dashboard/stores/dashboard-store';
import { router } from 'expo-router';

// Mock dependencies
jest.mock('@/src/data/repositories/accounts/accounts-repository');
jest.mock('@/src/ui/auth/view-models/useAuth');
jest.mock('@/src/shared/hooks/use-loading');
jest.mock('@/src/shared/hooks/use-alert-box');
jest.mock('@/src/ui/dashboard/stores/dashboard-store');
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: () => void) => {
    const React = require('react');
    React.useEffect(() => {
      callback();
    }, []);
  },
}));

describe('useAccounts', () => {
  const mockUser = { id: 'user-123' };
  const mockAccounts = [
    { id: '1', name: 'Account 1', balance: 100, type: 'checking' },
    { id: '2', name: 'Account 2', balance: 200, type: 'savings' },
  ];

  const mockSetIsLoading = jest.fn();
  const mockSetMessage = jest.fn();
  const mockSetIsVisible = jest.fn();
  const mockFetchDashboardData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useLoadingStore as unknown as jest.Mock).mockReturnValue({ setIsLoading: mockSetIsLoading });
    (useAlertBoxStore as unknown as jest.Mock).mockReturnValue({
      setMessage: mockSetMessage,
      setIsVisible: mockSetIsVisible,
    });
    (useDashboardStore as unknown as jest.Mock).mockReturnValue({
      fetchDashboardData: mockFetchDashboardData,
    });
  });

  it('should fetch accounts on mount', async () => {
    (accountsRepository.getAll as jest.Mock).mockResolvedValue({ data: mockAccounts, error: null });

    const { result } = renderHook(() => useAccounts());

    // act is needed for state updates
    await act(async () => {
      // Triggered by useFocusEffect in our mock
    });

    expect(accountsRepository.getAll).toHaveBeenCalled();
    expect(result.current.accounts).toHaveLength(2);
    expect(result.current.accounts[0].balance).toBe(200); // Sorted by balance
  });

  it('should handle error when fetching accounts', async () => {
    const error = { code: '500', message: 'DB Error' };
    (accountsRepository.getAll as jest.Mock).mockResolvedValue({ data: null, error });

    renderHook(() => useAccounts());

    await act(async () => {});

    expect(mockSetMessage).toHaveBeenCalledWith(expect.stringContaining('Erro ao carregar contas'));
    expect(mockSetIsVisible).toHaveBeenCalledWith(true);
  });

  it('should delete an account successfully', async () => {
    (accountsRepository.getAll as jest.Mock).mockResolvedValue({ data: mockAccounts, error: null });
    (accountsRepository.delete as jest.Mock).mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAccounts());

    // Wait for initial fetch
    await act(async () => {});

    await act(async () => {
      await result.current.deleteAccount('1');
    });

    expect(accountsRepository.delete).toHaveBeenCalledWith('1');
    expect(mockFetchDashboardData).toHaveBeenCalled();
    expect(result.current.accounts).toHaveLength(1);
    expect(result.current.accounts[0].id).toBe('2');
  });

  it('should create a new account successfully', async () => {
    (accountsRepository.create as jest.Mock).mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAccounts());

    act(() => {
      result.current.setName('New Account');
      result.current.setAmountInput('150.50');
      result.current.setType('checking');
    });

    await act(async () => {
      await result.current.handleSaveAccount();
    });

    expect(accountsRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      name: 'New Account',
      balance: 150.5,
      user_id: 'user-123',
    }));
    expect(mockFetchDashboardData).toHaveBeenCalled();
    expect(router.back).toHaveBeenCalled();
  });

  it('should show alert if name is empty on save', async () => {
    const { result } = renderHook(() => useAccounts());

    await act(async () => {
      await result.current.handleSaveAccount();
    });

    expect(mockSetMessage).toHaveBeenCalledWith('O nome da conta é obrigatório!');
    expect(mockSetIsVisible).toHaveBeenCalledWith(true);
    expect(accountsRepository.create).not.toHaveBeenCalled();
  });
});
