import { useState, useEffect, useCallback } from 'react';
import type { AuthInfo } from '@/types/plan';
import { api } from '@/services/api';

interface AuthState {
  user: AuthInfo['clientPrincipal'];
  loading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthInfo['clientPrincipal']>(null);
  const [loading, setLoading] = useState(true);

  const fetchAuth = useCallback(async () => {
    try {
      const data = await api.getAuthInfo();
      setUser(data.clientPrincipal);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuth();
  }, [fetchAuth]);

  return {
    user,
    loading,
    isAuthenticated: user !== null,
  };
}
