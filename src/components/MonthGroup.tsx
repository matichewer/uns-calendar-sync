import { CalendarEvent, getMonthName } from '@/utils/parseCalendar';
import { EventRow } from './EventRow';

interface MonthGroupProps {
  month: number;
  events: CalendarEvent[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onDeselectAll: (ids: string[]) => void;
}

export function MonthGroup({ month, events, selectedIds, onToggle, onSelectAll, onDeselectAll }: MonthGroupProps) {
  if (events.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center mb-3 px-2">
        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/90 
                       bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent
                       dark:from-primary dark:to-primary/80">
          {getMonthName(month)}
        </h3>
      </div>
      <div className="border-t-2 border-border/40 dark:border-border/60 mb-3 shadow-sm 
                      relative overflow-hidden
                      before:absolute before:inset-0 before:bg-gradient-to-r 
                      before:from-transparent before:via-primary/20 before:to-transparent" />
      <div className="space-y-0">
        {events.map(event => (
          <EventRow
            key={event.id}
            event={event}
            selected={selectedIds.has(event.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}
