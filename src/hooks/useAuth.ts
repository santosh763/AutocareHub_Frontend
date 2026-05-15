import { useAppSelector, useAppDispatch } from './useAppDispatch';
import { logout } from '../store/slices/authSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, token, loading, error } = useAppSelector((s) => s.auth);

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    logout: () => dispatch(logout()),
  };
}
