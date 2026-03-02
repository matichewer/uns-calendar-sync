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

  const ids = events.map(e => e.id);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {getMonthName(month)}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => onSelectAll(ids)}
            className="text-xs text-primary hover:underline font-medium"
          >
            Sel. todos
          </button>
          <span className="text-muted-foreground text-xs">·</span>
          <button
            onClick={() => onDeselectAll(ids)}
            className="text-xs text-muted-foreground hover:underline font-medium"
          >
            Desel. todos
          </button>
        </div>
      </div>
      <div className="border-t border-border mb-2" />
      <div className="space-y-0.5">
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
