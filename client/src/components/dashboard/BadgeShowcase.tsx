import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { BADGE_DEFINITIONS } from '@/lib/badges';
import type { Badge } from '@/types/plan';

interface BadgeShowcaseProps {
  badges: Badge[];
  className?: string;
}

export function BadgeShowcase({ badges, className }: BadgeShowcaseProps) {
  const earnedIds = new Set(badges.map(b => b.id));

  return (
    <div className={cn('', className)}>
      <h4 className="text-sm font-medium text-muted-foreground mb-3">Badges</h4>
      <div className="flex gap-3 flex-wrap">
        {BADGE_DEFINITIONS.map((def) => {
          const earned = earnedIds.has(def.id);
          return (
            <Tooltip key={def.id} content={`${def.name}: ${def.description}`}>
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all',
                  earned
                    ? 'bg-primary/10 ring-2 ring-primary/30 scale-100'
                    : 'bg-muted opacity-30 grayscale scale-90'
                )}
              >
                {def.icon}
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
