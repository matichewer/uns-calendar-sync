import { CalendarEvent } from '@/utils/parseCalendar';

const CATEGORY_LABELS: Record<string, string> = {
  feriado: 'Feriado',
  nolaborable: 'No laborable',
  asueto: 'Asueto',
  clases: 'Clases',
  general: 'General',
};

const CATEGORY_LABELS_SHORT: Record<string, string> = {
  feriado: 'Feriado',
  nolaborable: 'No lab.',
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
      className={`w-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-3 rounded-xl transition-all duration-200 text-left group mb-2.5 
        border-2 backdrop-blur-md
        ${
        selected
          ? `glass-strong border-primary/50 shadow-lg shadow-primary/10 
             bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5
             dark:from-primary/15 dark:via-primary/8 dark:to-primary/3
             dark:shadow-2xl dark:shadow-primary/20
             scale-[1.01] hover:scale-[1.02]`
          : `glass border-border/40 hover:border-border/70 shadow-md
             hover:shadow-lg hover:bg-gradient-to-br hover:from-secondary/50 hover:to-secondary/30
             dark:hover:from-secondary/30 dark:hover:to-secondary/20
             dark:shadow-xl
             hover:scale-[1.005] active:scale-[0.995]`
      }`} 
    >
      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 shadow-sm ${
        selected
          ? 'bg-primary border-primary shadow-primary/30'
          : 'border-foreground/40 bg-background/50 dark:border-foreground/50 group-hover:border-foreground/70 group-hover:bg-background/80'
      }`}>
        {selected && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="sm:w-[14px] sm:h-[14px]">
            <path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* Desktop: full date text; Mobile: stacked date */}
      <span className="text-sm font-medium text-muted-foreground w-20 sm:w-28 flex-shrink-0 font-mono hidden sm:inline">
        {event.dateFormatted}
      </span>

      <div className="sm:hidden w-11 flex-shrink-0 font-mono text-muted-foreground text-center leading-tight">
        <span className="block text-[10px] font-medium">{dateParts[0]}</span>
        <span className="block text-sm font-bold">{dateParts[1]}</span>
        <span className="block text-[10px] font-medium">{dateParts[2]}</span>
      </div>

      <span className="text-sm font-medium text-foreground flex-1 leading-relaxed min-w-0 break-words">
        {event.title}
      </span>

      {/* Mobile: short labels */}
      <span className={`badge-${event.category} sm:hidden text-[10px] font-semibold px-1.5 py-1 rounded-lg flex-shrink-0 shadow-sm border border-black/10 dark:border-white/10 whitespace-nowrap`}>
        {CATEGORY_LABELS_SHORT[event.category]}
      </span>

      {/* Desktop: full labels */}
      <span className={`badge-${event.category} hidden sm:inline-block text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 shadow-sm border border-black/10 dark:border-white/10 whitespace-nowrap`}>
        {CATEGORY_LABELS[event.category]}
      </span>
    </button>
  );
}
