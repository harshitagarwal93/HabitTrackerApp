import { useState, useEffect, useCallback } from 'react';
import type { PlanItem, Status, TrackId } from '@/types/plan';
import { api } from '@/services/api';
import { seedPlanData } from '@/data/seedPlan';

interface PlanItemsState {
  items: PlanItem[];
  loading: boolean;
  error: string | null;
  updateStatus: (id: string, status: Status) => Promise<PlanItem | undefined>;
  refresh: () => Promise<void>;
  filterByTrack: (trackId?: TrackId) => PlanItem[];
}

export function usePlanItems(): PlanItemsState {
  const [items, setItems] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let data = await api.getPlanItems();

      if (data.length === 0) {
        await api.seedPlan(seedPlanData);
        data = await api.getPlanItems();
      }
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load plan');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const updateStatus = useCallback(async (id: string, status: Status) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status,
              completedAt: status === 'completed' ? new Date().toISOString() : null,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );

    try {
      const updated = await api.updateItemStatus(id, status);
      setItems(prev => prev.map(item => (item.id === id ? updated : item)));
      return updated;
    } catch (err) {
      await fetchItems();
      throw err;
    }
  }, [fetchItems]);

  const filterByTrack = useCallback(
    (trackId?: TrackId) => {
      if (!trackId) return items;
      return items.filter(item => item.trackId === trackId);
    },
    [items]
  );

  return { items, loading, error, updateStatus, refresh: fetchItems, filterByTrack };
}
