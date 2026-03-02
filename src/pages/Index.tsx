import { useState, useEffect, useMemo, useCallback } from 'react';
import { parseCalendarHTML, CalendarEvent, getMonthFromDate } from '@/utils/parseCalendar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { MonthGroup } from '@/components/MonthGroup';
import { StickyBar } from '@/components/StickyBar';

type Category = CalendarEvent['category'] | 'todos';

const Index = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<Category>('todos');

  const fetchCalendar = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/calendar');
      const html = await res.text();
      const parsed = parseCalendarHTML(html);
      if (parsed.length === 0) throw new Error('Empty');
      setEvents(parsed);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCalendar(); }, [fetchCalendar]);

  const categoryCounts = useMemo(() => {
    const c: Record<string, number> = {};
    events.forEach(e => { c[e.category] = (c[e.category] || 0) + 1; });
    return c;
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (activeFilter === 'todos') return events;
    return events.filter(e => e.category === activeFilter);
  }, [events, activeFilter]);

  const monthGroups = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    filteredEvents.forEach(e => {
      const m = getMonthFromDate(e.date);
      if (!map.has(m)) map.set(m, []);
      map.get(m)!.push(e);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [filteredEvents]);

  const toggleEvent = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      ids.forEach(id => next.add(id));
      return next;
    });
  }, []);

  const deselectAll = useCallback((ids: string[]) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      ids.forEach(id => next.delete(id));
      return next;
    });
  }, []);

  const selectAllVisible = () => selectAll(filteredEvents.map(e => e.id));
  const deselectAllVisible = () => deselectAll(filteredEvents.map(e => e.id));

  const selectedEvents = events.filter(e => selectedIds.has(e.id));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Cargando calendario de la UNS...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-foreground font-medium">No se pudo cargar el calendario.</p>
          <p className="text-muted-foreground text-sm">Intentá de nuevo.</p>
          <button
            onClick={fetchCalendar}
            className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-[800px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            📅 UNS Calendario
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Seleccioná los eventos y exportalos a tu Google Calendar
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Datos en tiempo real desde uns.edu.ar
          </p>
        </div>

        {/* Main card */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-5">
          {/* Category filters */}
          <div className="mb-4">
            <CategoryFilter
              active={activeFilter}
              onChange={setActiveFilter}
              counts={categoryCounts}
            />
          </div>

          {/* Global controls */}
          <div className="flex gap-3 mb-5">
            <button
              onClick={selectAllVisible}
              className="text-xs font-medium text-primary hover:underline"
            >
              Seleccionar todos
            </button>
            <span className="text-muted-foreground text-xs">·</span>
            <button
              onClick={deselectAllVisible}
              className="text-xs font-medium text-muted-foreground hover:underline"
            >
              Deseleccionar todos
            </button>
            <span className="ml-auto text-xs text-muted-foreground">
              {filteredEvents.length} eventos
            </span>
          </div>

          {/* Events grouped by month */}
          {monthGroups.map(([month, evs]) => (
            <MonthGroup
              key={month}
              month={month}
              events={evs}
              selectedIds={selectedIds}
              onToggle={toggleEvent}
              onSelectAll={selectAll}
              onDeselectAll={deselectAll}
            />
          ))}

          {filteredEvents.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">
              No hay eventos en esta categoría.
            </p>
          )}
        </div>
      </div>

      <StickyBar selectedCount={selectedIds.size} selectedEvents={selectedEvents} />
    </div>
  );
};

export default Index;
