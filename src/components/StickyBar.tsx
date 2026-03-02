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
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border"
      style={{
        backgroundColor: 'hsl(var(--sticky-bar))',
        boxShadow: 'var(--sticky-bar-shadow)',
      }}
    >
      <div className="max-w-[800px] mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{selectedCount}</span>{' '}
          {selectedCount === 1 ? 'evento seleccionado' : 'eventos seleccionados'}
        </span>
        <button
          onClick={() => !disabled && downloadICS(selectedEvents)}
          disabled={disabled}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            disabled
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]'
          }`}
        >
          ⬇ Descargar .ics
        </button>
      </div>
    </div>
  );
}
