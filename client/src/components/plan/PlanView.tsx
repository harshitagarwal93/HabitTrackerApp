import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { PlanTree } from './PlanTree';
import { PlanList } from './PlanList';
import { TopicPanel } from '@/components/detail/TopicPanel';
import { useTreeBuilder } from '@/hooks/useTreeBuilder';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { PlanItem, Status, TrackId, TreeNode } from '@/types/plan';
import { List, GitBranch, Search } from 'lucide-react';

interface PlanViewProps {
  items: PlanItem[];
  onStatusChange: (id: string, status: Status) => void;
}

export function PlanView({ items, onStatusChange }: PlanViewProps) {
  const { trackId } = useParams<{ trackId?: string }>();
  const [view, setView] = useState<'tree' | 'list'>(() =>
    (localStorage.getItem('prep-tracker-view') as 'tree' | 'list') || 'tree'
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    let filtered = items;
    if (trackId) {
      filtered = filtered.filter(i => i.trackId === (trackId as TrackId));
    }
    if (search) {
      const lower = search.toLowerCase();
      const matchingIds = new Set<string>();
      for (const item of filtered) {
        if (item.title.toLowerCase().includes(lower) || item.description.toLowerCase().includes(lower)) {
          matchingIds.add(item.id);
          // Also include parents
          let current: PlanItem | undefined = item;
          while (current?.parentId) {
            matchingIds.add(current.parentId);
            current = filtered.find(i => i.id === current!.parentId);
          }
        }
      }
      filtered = filtered.filter(i => matchingIds.has(i.id));
    }
    return filtered;
  }, [items, trackId, search]);

  const tree = useTreeBuilder(filteredItems);
  const selectedItem = items.find(i => i.id === selectedId);

  const topics = filteredItems.filter(i => i.type === 'topic');
  const completedCount = topics.filter(i => i.status === 'completed').length;
  const pct = topics.length > 0 ? (completedCount / topics.length) * 100 : 0;

  const toggleView = (v: 'tree' | 'list') => {
    setView(v);
    localStorage.setItem('prep-tracker-view', v);
  };

  const handleSelect = (node: TreeNode | PlanItem) => {
    setSelectedId(node.id);
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left panel — tree/list */}
      <div className="w-[420px] shrink-0 border-r flex flex-col">
        {/* Toolbar */}
        <div className="p-3 border-b space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search topics..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex rounded-md border">
              <Button
                variant={view === 'tree' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8 rounded-r-none"
                onClick={() => toggleView('tree')}
                title="Tree view"
              >
                <GitBranch className="w-4 h-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8 rounded-l-none"
                onClick={() => toggleView('list')}
                title="List view"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={pct} className="flex-1 h-1.5" />
            <span className="text-xs text-muted-foreground shrink-0">
              {completedCount}/{topics.length}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {view === 'tree' ? (
            <PlanTree roots={tree} selectedId={selectedId} onSelect={handleSelect} />
          ) : (
            <PlanList items={filteredItems} selectedId={selectedId} onSelect={handleSelect} />
          )}
        </div>
      </div>

      {/* Right panel — detail */}
      <div className="flex-1 min-w-0">
        {selectedItem ? (
          <TopicPanel
            item={selectedItem}
            allItems={items}
            onStatusChange={onStatusChange}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <div className="text-4xl mb-3">📚</div>
              <p>Select a topic to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
