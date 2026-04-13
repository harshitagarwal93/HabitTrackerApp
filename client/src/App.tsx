import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { PlanView } from '@/components/plan/PlanView';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { usePlanItems } from '@/hooks/usePlanItems';
import { useUserStats } from '@/hooks/useUserStats';

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { items, loading, updateStatus } = usePlanItems();
  const { stats, loading: statsLoading, refresh: refreshStats } = useUserStats();

  const handleStatusChange = async (id: string, status: Parameters<typeof updateStatus>[1]) => {
    await updateStatus(id, status);
    await refreshStats();
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
              loading={loading || statsLoading}
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
