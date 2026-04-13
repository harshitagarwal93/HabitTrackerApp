import { cn } from '@/lib/utils';
import type { Resource } from '@/types/plan';
import { BookOpen, FileText, Video, Globe, Code2, Newspaper } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
}

const typeIcon: Record<string, React.ReactNode> = {
  book: <BookOpen className="w-4 h-4" />,
  docs: <FileText className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  blog: <Newspaper className="w-4 h-4" />,
  platform: <Globe className="w-4 h-4" />,
  github: <Code2 className="w-4 h-4" />,
};

const typeColor: Record<string, string> = {
  book: 'text-amber-400 bg-amber-500/10',
  docs: 'text-blue-400 bg-blue-500/10',
  video: 'text-red-400 bg-red-500/10',
  blog: 'text-purple-400 bg-purple-500/10',
  platform: 'text-emerald-400 bg-emerald-500/10',
  github: 'text-gray-400 bg-gray-500/10',
};

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover-lift transition-all">
        <div className={cn('p-2 rounded-md shrink-0', typeColor[resource.type])}>
          {typeIcon[resource.type] ?? <Globe className="w-4 h-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium group-hover:text-primary transition-colors truncate">
            {resource.title}
          </div>
          {resource.notes && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{resource.notes}</p>
          )}
        </div>
      </div>
    </a>
  );
}
