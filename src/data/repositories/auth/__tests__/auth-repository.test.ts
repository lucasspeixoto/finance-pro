import { authRepository } from '../auth-repository';
import { authService } from '@/src/data/services/auth/auth-service';

jest.mock('@/src/data/services/auth/auth-service');

describe('AuthRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call authService.signIn', async () => {
    (authService.signIn as jest.Mock).mockResolvedValue({ data: {}, error: null });

    await authRepository.signIn('test@example.com', 'password123');

    expect(authService.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
  });

  it('should call authService.resetPassword', async () => {
    (authService.resetPassword as jest.Mock).mockResolvedValue({ data: {}, error: null });

    await authRepository.resetPassword('test@example.com');

    expect(authService.resetPassword).toHaveBeenCalledWith('test@example.com');
  });

  it('should call authService.signOut', async () => {
    (authService.signOut as jest.Mock).mockResolvedValue({ error: null });

    await authRepository.signOut();

    expect(authService.signOut).toHaveBeenCalled();
  });

  it('should call authService.getSession and return session', async () => {
    const mockSession = { user: { id: '1' } };
    (authService.getSession as jest.Mock).mockResolvedValue({ data: { session: mockSession } });

    const result = await authRepository.getSession();

    expect(authService.getSession).toHaveBeenCalled();
    expect(result).toEqual(mockSession);
  });

  it('should call authService.onAuthStateChange', () => {
    const callback = jest.fn();
    (authService.onAuthStateChange as jest.Mock).mockReturnValue({ data: { subscription: {} } });

    authRepository.onAuthStateChange(callback);

    expect(authService.onAuthStateChange).toHaveBeenCalledWith(callback);
  });
});
