import { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { PlanView } from '@/components/plan/PlanView';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { seedPlanData } from '@/data/seedPlan';
import type { PlanItem, UserStats, Status } from '@/types/plan';
import { toast } from 'sonner';

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [items, setItems] = useState<PlanItem[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      let data = await api.init();

      // Auto-seed on first login
      if (data.items.length === 0) {
        await api.seedPlan(seedPlanData);
        data = await api.init();
      }

      setItems(data.items);
      setStats(data.stats);
    } catch {
      // silently fail — user may not be authenticated yet
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleStatusChange = async (id: string, status: Status) => {
    // Optimistic update — instant UI response
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status, completedAt: status === 'completed' ? new Date().toISOString() : null, updatedAt: new Date().toISOString() }
          : item
      )
    );

    try {
      const result = await api.updateItemStatus(id, status) as PlanItem & { _newBadges?: Array<{ icon: string; name: string; description: string }> };
      setItems(prev => prev.map(item => (item.id === id ? result : item)));

      // Refresh stats in background
      const { stats: newStats } = await api.init();
      setStats(newStats);

      if (result._newBadges?.length) {
        for (const badge of result._newBadges) {
          toast.success(`Badge earned: ${badge.icon} ${badge.name}`, { description: badge.description });
        }
      }
    } catch {
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isDark={isDark}
        onToggleTheme={toggleTheme}
        userName={user?.userDetails ?? null}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              stats={stats}
              items={items}
              loading={loading}
            />
          }
        />
        <Route
          path="/plan/:trackId?"
          element={
            <PlanView
              items={items}
              onStatusChange={handleStatusChange}
            />
          }
        />
      </Routes>
    </div>
  );
}
