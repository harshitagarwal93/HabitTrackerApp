interface ArchNotesProps {
  notes: string[];
}

export function ArchNotes({ notes }: ArchNotesProps) {
  if (notes.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Architectural Decisions</h4>
      <div className="space-y-2">
        {notes.map((note, i) => (
          <div
            key={i}
            className="flex gap-3 pl-3 border-l-2 border-primary/30 text-sm text-foreground/90"
          >
            <span className="text-primary/60 font-mono text-xs shrink-0 mt-0.5">{i + 1}.</span>
            <span>{note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
