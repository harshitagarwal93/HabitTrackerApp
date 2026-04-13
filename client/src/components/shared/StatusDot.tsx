import type { Status } from '@/types/plan';
import { cn } from '@/lib/utils';

interface StatusDotProps {
  status: Status;
  className?: string;
}

const dotColors: Record<Status, string> = {
  'not-started': 'bg-muted-foreground/40',
  'in-progress': 'bg-blue-400',
  'completed': 'bg-emerald-400',
};

export function StatusDot({ status, className }: StatusDotProps) {
  return (
    <span className={cn('inline-block w-2.5 h-2.5 rounded-full transition-colors duration-200', dotColors[status], className)} />
  );
}
