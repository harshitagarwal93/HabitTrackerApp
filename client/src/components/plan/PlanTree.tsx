import type { TreeNode } from '@/types/plan';
import { TreeNodeItem } from './TreeNode';

interface PlanTreeProps {
  roots: TreeNode[];
  selectedId: string | null;
  onSelect: (node: TreeNode) => void;
}

export function PlanTree({ roots, selectedId, onSelect }: PlanTreeProps) {
  if (roots.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No items to display
      </div>
    );
  }

  return (
    <div className="py-2">
      {roots.map(root => (
        <TreeNodeItem
          key={root.id}
          node={root}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
