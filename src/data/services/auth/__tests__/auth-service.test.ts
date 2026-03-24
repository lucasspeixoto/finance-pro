import { authService } from '../auth-service';
import { supabase } from '@/src/utils/supabase';

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should sign in with email and password', async () => {
    const mockResponse = { data: { user: { id: '1' } }, error: null };
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue(mockResponse);

    const result = await authService.signIn('test@example.com', 'password123');

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result).toEqual(mockResponse);
  });

  it('should reset password', async () => {
    const mockResponse = { data: {}, error: null };
    (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValue(mockResponse);

    const result = await authService.resetPassword('test@example.com');

    expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com');
    expect(result).toEqual(mockResponse);
  });

  it('should sign out', async () => {
    const mockResponse = { error: null };
    (supabase.auth.signOut as jest.Mock).mockResolvedValue(mockResponse);

    const result = await authService.signOut();

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it('should get session', async () => {
    const mockResponse = { data: { session: { user: { id: '1' } } }, error: null };
    (supabase.auth.getSession as jest.Mock).mockResolvedValue(mockResponse);

    const result = await authService.getSession();

    expect(supabase.auth.getSession).toHaveBeenCalled();
    expect(result).toEqual(mockResponse);
  });

  it('should handle onAuthStateChange', () => {
    const callback = jest.fn();
    const mockSubscription = { data: { subscription: { unsubscribe: jest.fn() } } };
    (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue(mockSubscription);

    const result = authService.onAuthStateChange(callback);

    expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
    expect(result).toEqual(mockSubscription);

    // Trigger the actual callback passed to onAuthStateChange
    const authChangeHandler = (supabase.auth.onAuthStateChange as jest.Mock).mock.calls[0][0];
    const mockSession = { user: { id: '1' } };
    authChangeHandler('SIGNED_IN', mockSession);

    expect(callback).toHaveBeenCalledWith(mockSession);
  });
});
