import { PlanListCard } from './PlanListCard';
import type { PlanItem } from '@/types/plan';

interface PlanListProps {
  items: PlanItem[];
  selectedId: string | null;
  onSelect: (item: PlanItem) => void;
}

export function PlanList({ items, selectedId, onSelect }: PlanListProps) {
  // Group by phases
  const phases = items.filter(i => i.type === 'phase').sort((a, b) => a.order - b.order);

  if (items.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No items to display
      </div>
    );
  }

  return (
    <div className="py-2 space-y-4">
      {phases.map(phase => {
        const topics = items
          .filter(i => i.parentId === phase.id && i.type === 'topic')
          .sort((a, b) => a.order - b.order);

        return (
          <div key={phase.id}>
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm px-4 py-2.5 border-b">
              <h3 className="text-sm font-semibold text-muted-foreground">
                {phase.title}
                {phase.weekRange && <span className="ml-2 text-xs font-normal">W{phase.weekRange}</span>}
              </h3>
            </div>
            <div className="space-y-2 p-3">
              {topics.map(topic => (
                <PlanListCard
                  key={topic.id}
                  item={topic}
                  isSelected={selectedId === topic.id}
                  onClick={() => onSelect(topic)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
