import { Square, CheckSquare } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface PracticeChecklistProps {
  items: string[];
}

export function PracticeChecklist({ items }: PracticeChecklistProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  if (items.length === 0) return null;

  const toggle = (i: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <div>
      <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Practice Items</h4>
      <div className="space-y-1">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className="flex items-start gap-3 text-sm text-left w-full hover:bg-accent/30 rounded-md px-3 py-2 transition-colors cursor-pointer"
          >
            {checked.has(i) ? (
              <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <Square className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            )}
            <span className={cn(checked.has(i) && 'line-through text-muted-foreground')}>
              {item}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
