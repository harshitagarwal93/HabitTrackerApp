import { Card, CardContent } from '@/components/ui/card';
import { ProgressRing } from '@/components/shared/ProgressRing';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TrackStats, TrackId } from '@/types/plan';

interface TrackCardProps {
  trackId: TrackId;
  title: string;
  stats: TrackStats;
  currentPhase?: string;
  onContinue: () => void;
  delay?: number;
  className?: string;
}

const trackIcons: Record<TrackId, string> = {
  azure: '☁️',
  cp: '🧮',
};

const trackColors: Record<TrackId, string> = {
  azure: 'text-blue-400',
  cp: 'text-emerald-400',
};

export function TrackCard({ trackId, title, stats, currentPhase, onContinue, delay = 0, className }: TrackCardProps) {
  const pct = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <Card
      className={cn('hover-lift animate-card-enter', className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <ProgressRing value={pct} size={100} strokeWidth={7}>
            <span className="text-2xl">{trackIcons[trackId]}</span>
          </ProgressRing>
          <div className="flex-1 min-w-0">
            <h3 className={cn('text-lg font-semibold', trackColors[trackId])}>{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {stats.completed} / {stats.total} topics • {Math.round(pct)}%
            </p>
            {currentPhase && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                Current: {currentPhase}
              </p>
            )}
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={onContinue}
            >
              Continue →
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
