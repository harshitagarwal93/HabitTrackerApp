import { useState, useEffect, useCallback } from 'react';
import type { UserStats } from '@/types/plan';
import { api } from '@/services/api';

interface UserStatsState {
  stats: UserStats | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useUserStats(): UserStatsState {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getUserStats();
      setStats(data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refresh: fetchStats };
}
