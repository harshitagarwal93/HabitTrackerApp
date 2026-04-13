import { cn } from '@/lib/utils';
import { isStreakActive, getStreakMessage } from '@/lib/streaks';

interface StreakCounterProps {
  currentStreak: number;
  lastActivityDate: string;
  className?: string;
}

export function StreakCounter({ currentStreak, lastActivityDate, className }: StreakCounterProps) {
  const active = isStreakActive(lastActivityDate);

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className={cn(
        'text-5xl select-none',
        active ? 'animate-flame' : 'opacity-30 grayscale'
      )}>
        🔥
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold">{currentStreak}</div>
        <div className="text-sm text-muted-foreground">{getStreakMessage(currentStreak)}</div>
      </div>
    </div>
  );
}
