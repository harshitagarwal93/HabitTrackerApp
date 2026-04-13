import type { PlanItem, TreeNode } from '@/types/plan';

interface BreadcrumbProps {
  item: PlanItem;
  allItems: PlanItem[] | TreeNode[];
  className?: string;
}

export function Breadcrumb({ item, allItems, className }: BreadcrumbProps) {
  const chain: string[] = [];
  let current: PlanItem | undefined = item;

  while (current) {
    chain.unshift(current.title);
    current = current.parentId
      ? (allItems as PlanItem[]).find(i => i.id === current!.parentId)
      : undefined;
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {chain.map((title, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-muted-foreground/50">›</span>}
            <span className={i === chain.length - 1 ? 'text-foreground font-medium' : ''}>{title}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
