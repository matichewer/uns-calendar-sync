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
      className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-border/40 glass-strong backdrop-blur-2xl"
      style={{
        boxShadow: '0 -8px 32px rgba(0,0,0,0.12), 0 -2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <div className="max-w-[800px] mx-auto px-4 py-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          <span className="font-bold text-lg text-foreground">{selectedCount}</span>{' '}
          {selectedCount === 1 ? 'evento seleccionado' : 'eventos seleccionados'}
        </span>
        <button
          onClick={() => !disabled && downloadICS(selectedEvents)}
          disabled={disabled}
          className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg ${
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
