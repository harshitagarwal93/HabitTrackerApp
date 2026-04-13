import ReactMarkdown from 'react-markdown';
import { StatusSelector } from '@/components/shared/StatusSelector';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ResourceCard } from './ResourceCard';
import { ArchNotes } from './ArchNotes';
import { PracticeChecklist } from './PracticeChecklist';
import type { PlanItem, Status } from '@/types/plan';

interface TopicPanelProps {
  item: PlanItem;
  allItems: PlanItem[];
  onStatusChange: (id: string, status: Status) => void;
}

export function TopicPanel({ item, allItems, onStatusChange }: TopicPanelProps) {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div>
        <Breadcrumb item={item} allItems={allItems} className="mb-2" />
        <h2 className="text-xl font-bold">{item.title}</h2>
        {item.weekRange && (
          <span className="text-xs text-muted-foreground">Weeks {item.weekRange}</span>
        )}
      </div>

      <StatusSelector
        value={item.status}
        onChange={(status) => onStatusChange(item.id, status)}
      />

      {item.description && (
        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90">
          <ReactMarkdown>{item.description}</ReactMarkdown>
        </div>
      )}

      {item.resources.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Resources</h4>
          <div className="space-y-2">
            {item.resources.map((res, i) => (
              <ResourceCard key={i} resource={res} />
            ))}
          </div>
        </div>
      )}

      {item.architecturalNotes.length > 0 && (
        <ArchNotes notes={item.architecturalNotes} />
      )}

      {item.practiceItems.length > 0 && (
        <PracticeChecklist items={item.practiceItems} />
      )}
    </div>
  );
}
