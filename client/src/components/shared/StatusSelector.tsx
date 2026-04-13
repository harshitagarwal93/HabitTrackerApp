import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';
import type { Status } from '@/types/plan';

interface StatusSelectorProps {
  value: Status;
  onChange: (status: Status) => void;
  className?: string;
}

const statuses: { value: Status; label: string; color: string; activeColor: string }[] = [
  { value: 'not-started', label: 'Not Started', color: 'text-muted-foreground', activeColor: 'bg-muted text-foreground' },
  { value: 'in-progress', label: 'In Progress', color: 'text-blue-400', activeColor: 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30' },
  { value: 'completed', label: 'Completed', color: 'text-emerald-400', activeColor: 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' },
];

export function StatusSelector({ value, onChange, className }: StatusSelectorProps) {
  const handleChange = (status: Status) => {
    if (status === value) return;
    onChange(status);
    if (status === 'completed') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
      });
    }
  };

  return (
    <div className={cn('inline-flex rounded-lg bg-muted/50 p-1 gap-1', className)}>
      {statuses.map((s) => (
        <button
          key={s.value}
          onClick={() => handleChange(s.value)}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer',
            value === s.value ? s.activeColor : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
