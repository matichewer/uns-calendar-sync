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
  const dateParts = event.dateFormatted.split(' ');
  return (
    <button
      onClick={() => onToggle(event.id)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-full transition-colors text-left group mb-3 overflow-hidden ${
        selected
          ? `bg-[hsl(var(--selected-row))] glass-strong ring-1 ring-border/20 shadow-sm bg-gradient-to-b from-white/6 to-white/2 dark:from-black/20 dark:to-black/10`
          : 'bg-white/6 dark:bg-black/20 hover:bg-secondary/60 shadow-sm ring-1 ring-border/20 bg-gradient-to-b from-white/4 to-white/2 dark:from-black/18 dark:to-black/12'
      }`} 
    >
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
        selected
          ? 'bg-primary border-primary'
          : 'border-black/50 dark:border-white/60 group-hover:border-muted-foreground dark:group-hover:border-white'
      }`}>
        {selected && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* Desktop: full date text; Mobile: stacked date */}
      <span className="text-sm text-muted-foreground w-20 sm:w-24 flex-shrink-0 font-mono hidden sm:inline">
        {event.dateFormatted}
      </span>

      <div className="sm:hidden w-12 flex-shrink-0 font-mono text-muted-foreground text-center leading-tight">
        <span className="block text-xs">{dateParts[0]}</span>
        <span className="block text-sm font-medium">{dateParts[1]}</span>
        <span className="block text-xs">{dateParts[2]}</span>
      </div>

      <span className="text-sm text-foreground flex-1 leading-snug">
        {event.title}
      </span>

      <span className={`badge-${event.category} text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0`}>
        {CATEGORY_LABELS[event.category]}
      </span>
    </button>
  );
}
