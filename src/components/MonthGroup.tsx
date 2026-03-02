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
    <div className="mb-6">
      <div className="flex items-center mb-2 px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {getMonthName(month)}
        </h3>
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
