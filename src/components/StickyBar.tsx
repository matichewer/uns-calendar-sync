import { downloadICS } from '@/utils/generateICS';
import { CalendarEvent } from '@/utils/parseCalendar';

interface StickyBarProps {
  selectedCount: number;
  selectedEvents: CalendarEvent[];
}

export function StickyBar({ selectedCount, selectedEvents }: StickyBarProps) {
  const disabled = selectedCount === 0;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-border/40 dark:border-border/60 glass-strong backdrop-blur-2xl
                 shadow-[0_-8px_32px_rgba(0,0,0,0.12),0_-2px_8px_rgba(0,0,0,0.08)]
                 dark:shadow-[0_-12px_48px_rgba(0,0,0,0.50),0_-4px_16px_rgba(0,0,0,0.40)]"
    >
      <div className="max-w-[800px] md:max-w-[1000px] lg:max-w-[1100px] mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-3">
        <span className="text-xs sm:text-sm text-muted-foreground">
          <span className="font-bold text-base sm:text-lg text-foreground">{selectedCount}</span>{' '}
          <span className="hidden sm:inline">
            {selectedCount === 1 ? 'evento seleccionado' : 'eventos seleccionados'}
          </span>
          <span className="sm:hidden">
            {selectedCount === 1 ? 'evento' : 'eventos'}
          </span>
        </span>
        <button
          onClick={() => !disabled && downloadICS(selectedEvents)}
          disabled={disabled}
          className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg ${
            disabled
              ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
              : 'bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.97] hover:shadow-xl hover:shadow-primary/20'
          }`}
        >
          ⬇ Descargar .ics
        </button>
      </div>
    </div>
  );
}
