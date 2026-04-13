import { cn } from '@/lib/utils';

interface WeeklyHeatmapProps {
  weeklyActivity: Record<string, number>;
  className?: string;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getThisWeekActivity(weeklyActivity: Record<string, number>): number[] {
  // Simple: return activity counts for this week, one per day
  // In v1, we just use the weekly total divided across days as a visual
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon...
  const counts: number[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    const offset = i - ((dayOfWeek + 6) % 7); // Mon=0
    d.setDate(d.getDate() + offset);
    const key = d.toISOString().split('T')[0];
    counts.push(weeklyActivity[key] || 0);
  }

  return counts;
}

function getIntensity(count: number): string {
  if (count === 0) return 'bg-muted';
  if (count === 1) return 'bg-emerald-900/30 dark:bg-emerald-400/20';
  if (count === 2) return 'bg-emerald-700/40 dark:bg-emerald-400/40';
  if (count <= 4) return 'bg-emerald-600/60 dark:bg-emerald-400/60';
  return 'bg-emerald-500 dark:bg-emerald-400';
}

export function WeeklyHeatmap({ weeklyActivity, className }: WeeklyHeatmapProps) {
  const counts = getThisWeekActivity(weeklyActivity);

  return (
    <div className={cn('', className)}>
      <h4 className="text-sm font-medium text-muted-foreground mb-3">This Week</h4>
      <div className="flex gap-1.5">
        {DAYS.map((day, i) => (
          <div key={day} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                'w-8 h-8 rounded-md transition-colors',
                getIntensity(counts[i])
              )}
              title={`${day}: ${counts[i]} items`}
            />
            <span className="text-[10px] text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
