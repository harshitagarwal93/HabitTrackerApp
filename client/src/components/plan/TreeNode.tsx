import { useState } from 'react';
import { cn } from '@/lib/utils';
import { StatusDot } from '@/components/shared/StatusDot';
import { Progress } from '@/components/ui/progress';
import type { TreeNode } from '@/types/plan';
import { ChevronRight } from 'lucide-react';

interface TreeNodeProps {
  node: TreeNode;
  depth?: number;
  selectedId: string | null;
  onSelect: (node: TreeNode) => void;
}

export function TreeNodeItem({ node, depth = 0, selectedId, onSelect }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children.length > 0;
  const pct = node.totalCount > 0 ? (node.completedCount / node.totalCount) * 100 : 0;
  const isSelected = selectedId === node.id;

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-sm',
          isSelected ? 'bg-accent' : 'hover:bg-accent/50',
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          onSelect(node);
          if (hasChildren) setExpanded(!expanded);
        }}
      >
        {hasChildren ? (
          <ChevronRight
            className={cn(
              'w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0',
              expanded && 'rotate-90'
            )}
          />
        ) : (
          <span className="w-4 shrink-0" />
        )}
        <StatusDot status={node.computedStatus} />
        <span className={cn('truncate flex-1', node.type === 'track' && 'font-semibold', node.type === 'phase' && 'font-medium')}>
          {node.title}
        </span>
        {node.type === 'phase' && node.totalCount > 0 && (
          <div className="w-16 shrink-0">
            <Progress value={pct} className="h-1.5" />
          </div>
        )}
        {node.weekRange && (
          <span className="text-[10px] text-muted-foreground shrink-0">W{node.weekRange}</span>
        )}
      </div>

      {hasChildren && (
        <div
          className="tree-content"
          style={{
            maxHeight: expanded ? `${node.children.length * 300}px` : '0px',
            opacity: expanded ? 1 : 0,
          }}
        >
          {node.children.map(child => (
            <TreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
