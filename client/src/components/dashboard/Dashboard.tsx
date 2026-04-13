import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { StreakCounter } from './StreakCounter';
import { TrackCard } from './TrackCard';
import { WeeklyHeatmap } from './WeeklyHeatmap';
import { BadgeShowcase } from './BadgeShowcase';
import type { UserStats, PlanItem, TrackId } from '@/types/plan';

interface DashboardProps {
  stats: UserStats | null;
  items: PlanItem[];
  loading: boolean;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getCurrentPhase(items: PlanItem[], trackId: TrackId): string | undefined {
  const phases = items
    .filter(i => i.trackId === trackId && i.type === 'phase')
    .sort((a, b) => a.order - b.order);

  for (const phase of phases) {
    const topics = items.filter(i => i.parentId === phase.id && i.type === 'topic');
    const allDone = topics.every(t => t.status === 'completed');
    if (!allDone) return phase.title;
  }

  return phases[phases.length - 1]?.title;
}

export function Dashboard({ stats, items, loading }: DashboardProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 px-8 py-6">
        {/* Skeleton greeting */}
        <div>
          <div className="h-9 w-72 bg-muted rounded-lg animate-pulse" />
          <div className="h-5 w-96 bg-muted/60 rounded mt-2 animate-pulse" />
        </div>
        {/* Skeleton streak + badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-card border rounded-lg animate-pulse" />
          <div className="h-48 bg-card border rounded-lg animate-pulse" />
        </div>
        {/* Skeleton track cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-36 bg-card border rounded-lg animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  const safeStats: UserStats = stats ?? {
    id: 'stats',
    userId: '',
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: '',
    totalCompleted: 0,
    badges: [],
    weeklyActivity: {},
    trackStats: { azure: { completed: 0, total: 0 }, cp: { completed: 0, total: 0 }, csharp: { completed: 0, total: 0 } },
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-8 py-6">
      {/* Hero */}
      <div className="animate-card-enter">
        <h1 className="text-3xl font-bold">{getGreeting()} 👋</h1>
        <p className="text-muted-foreground mt-1">
          Track your progress across Azure architecture, C# mastery, and competitive programming.
        </p>
      </div>

      {/* Streak + Heatmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="animate-card-enter" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-6 flex items-center justify-center">
            <StreakCounter
              currentStreak={safeStats.currentStreak}
              lastActivityDate={safeStats.lastActivityDate}
            />
          </CardContent>
        </Card>
        <Card className="animate-card-enter" style={{ animationDelay: '200ms' }}>
          <CardContent className="p-6">
            <WeeklyHeatmap weeklyActivity={safeStats.weeklyActivity} />
            <div className="mt-4">
              <BadgeShowcase badges={safeStats.badges} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Track Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TrackCard
          trackId="azure"
          title="Azure & Cloud Architecture"
          stats={safeStats.trackStats.azure}
          currentPhase={getCurrentPhase(items, 'azure')}
          onContinue={() => navigate('/plan/azure')}
          delay={300}
        />
        <TrackCard
          trackId="csharp"
          title="C# Language Mastery"
          stats={safeStats.trackStats.csharp}
          currentPhase={getCurrentPhase(items, 'csharp')}
          onContinue={() => navigate('/plan/csharp')}
          delay={350}
        />
        <TrackCard
          trackId="cp"
          title="Competitive Programming (C#)"
          stats={safeStats.trackStats.cp}
          currentPhase={getCurrentPhase(items, 'cp')}
          onContinue={() => navigate('/plan/cp')}
          delay={400}
        />
      </div>
    </div>
  );
}
