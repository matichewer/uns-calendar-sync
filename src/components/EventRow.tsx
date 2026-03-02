import { CalendarEvent } from '@/utils/parseCalendar';

const CATEGORY_LABELS: Record<string, string> = {
  feriado: 'Feriado',
  nolaborable: 'No laborable',
  asueto: 'Asueto',
  clases: 'Clases',
  general: 'General',
};

interface EventRowProps {
  event: CalendarEvent;
  selected: boolean;
  onToggle: (id: string) => void;
}

export function EventRow({ event, selected, onToggle }: EventRowProps) {
  return (
    <button
      onClick={() => onToggle(event.id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left group ${
        selected
          ? `bg-[hsl(var(--selected-row))] glass-strong`
          : 'glass-subtle hover:bg-secondary/60'
      }`}
    >
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
        selected
          ? 'bg-primary border-primary'
          : 'border-border group-hover:border-muted-foreground'
      }`}>
        {selected && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      <span className="text-sm text-muted-foreground w-24 flex-shrink-0 font-mono">
        {event.dateFormatted}
      </span>

      <span className="text-sm text-foreground flex-1 leading-snug">
        {event.title}
      </span>

      <span className={`badge-${event.category} text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0`}>
        {CATEGORY_LABELS[event.category]}
      </span>
    </button>
  );
}
