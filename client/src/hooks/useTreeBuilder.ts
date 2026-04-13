import { useMemo } from 'react';
import type { PlanItem, TreeNode, Status } from '@/types/plan';

function computeNodeStatus(node: TreeNode): { status: Status; completed: number; total: number } {
  if (node.children.length === 0) {
    return {
      status: node.status,
      completed: node.status === 'completed' ? 1 : 0,
      total: 1,
    };
  }

  let completed = 0;
  let total = 0;

  for (const child of node.children) {
    const childStats = computeNodeStatus(child);
    child.computedStatus = childStats.status;
    child.completedCount = childStats.completed;
    child.totalCount = childStats.total;
    completed += childStats.completed;
    total += childStats.total;
  }

  let status: Status = 'not-started';
  if (completed === total && total > 0) {
    status = 'completed';
  } else if (completed > 0) {
    status = 'in-progress';
  }

  return { status, completed, total };
}

function buildTree(items: PlanItem[]): TreeNode[] {
  const nodeMap = new Map<string, TreeNode>();

  const sorted = [...items].sort((a, b) => a.order - b.order);

  for (const item of sorted) {
    nodeMap.set(item.id, {
      ...item,
      children: [],
      computedStatus: item.status,
      completedCount: 0,
      totalCount: 0,
    });
  }

  const roots: TreeNode[] = [];

  for (const item of sorted) {
    const node = nodeMap.get(item.id)!;
    if (item.parentId && nodeMap.has(item.parentId)) {
      nodeMap.get(item.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  for (const root of roots) {
    const stats = computeNodeStatus(root);
    root.computedStatus = stats.status;
    root.completedCount = stats.completed;
    root.totalCount = stats.total;
  }

  return roots;
}

export function useTreeBuilder(items: PlanItem[]): TreeNode[] {
  return useMemo(() => buildTree(items), [items]);
}
