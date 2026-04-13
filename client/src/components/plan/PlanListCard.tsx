import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusDot } from '@/components/shared/StatusDot';
import { cn } from '@/lib/utils';
import type { PlanItem } from '@/types/plan';

interface PlanListCardProps {
  item: PlanItem;
  isSelected: boolean;
  onClick: () => void;
}

const typeBadgeColor: Record<string, string> = {
  track: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  phase: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  topic: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

export function PlanListCard({ item, isSelected, onClick }: PlanListCardProps) {
  return (
    <Card
      className={cn(
        'hover-lift cursor-pointer transition-all',
        isSelected && 'ring-2 ring-primary/50'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <StatusDot status={item.status} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate">{item.title}</span>
              <Badge variant="outline" className={cn('text-[10px] shrink-0', typeBadgeColor[item.type])}>
                {item.type}
              </Badge>
            </div>
            {item.weekRange && (
              <span className="text-xs text-muted-foreground">Weeks {item.weekRange}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
