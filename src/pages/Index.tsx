import { useState, useEffect, useMemo, useCallback } from 'react';
import { parseCalendarHTML, CalendarEvent, getMonthFromDate } from '@/utils/parseCalendar';
import { CategoryFilter } from '@/components/CategoryFilter';
import { MonthGroup } from '@/components/MonthGroup';
import { StickyBar } from '@/components/StickyBar';
import useTheme from '@/hooks/use-theme';

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
        <div className="loader-fade text-center space-y-5 p-8 glass-strong rounded-2xl shadow-2xl">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto shadow-lg" />
          <p className="text-foreground text-xl font-semibold">Cargando calendario de la UNS...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-5 p-8 glass-strong rounded-2xl shadow-2xl">
          <p className="text-foreground font-semibold text-xl">No se pudo cargar el calendario.</p>
          <p className="text-muted-foreground">Intentá de nuevo.</p>
          <button
            onClick={fetchCalendar}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-[800px] md:max-w-[1000px] lg:max-w-[1100px] mx-auto px-2 sm:px-4 py-8">
        {/* Header */}
        <div className="mb-8 glass-subtle rounded-2xl p-3 sm:p-6 shadow-lg border-2 border-border/30 dark:border-border/50">
          <div className="flex items-start justify-between">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <img src="/logo-uns.webp" alt="Universidad Nacional del Sur" className="w-10 h-10 md:w-12 md:h-12 lg:w-20 lg:h-20 object-contain rounded" />
              <span>Calendario UNS</span>
            </h1>
            <div className="inline-flex items-center gap-2">
              <a
                href="https://github.com/matichewer/uns-calendar-sync"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                aria-label="Ver en GitHub"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.97-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.56-.29-5.25-1.28-5.25-5.71 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18.91-.25 1.9-.38 2.88-.38.98 0 1.97.13 2.88.38 2.18-1.49 3.14-1.18 3.14-1.18.62 1.59.23 2.77.11 3.06.74.81 1.18 1.84 1.18 3.1 0 4.44-2.69 5.42-5.26 5.7.41.35.77 1.04.77 2.1 0 1.52-.01 2.75-.01 3.12 0 .3.21.66.79.55C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
                </svg>
                <span className="hidden sm:inline">Ver en GitHub</span>
              </a>
              <ThemeToggle />
            </div>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Seleccioná los eventos y exportalos a tu calendario favorito
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Datos en tiempo real desde{' '}
            <a
              href="https://www.uns.edu.ar/alumnos/calendario-academico"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/80 hover:underline"
            >
              el calendario académico de la UNS
            </a>
          </p>
        </div>

        {/* Main card */}
        <div className="glass-strong rounded-2xl shadow-2xl border-2 border-border/40 dark:border-border/60 p-3 sm:p-6">
          {/* Category filters */}
          <div className="mb-4">
            <CategoryFilter
              active={activeFilter}
              onChange={setActiveFilter}
              counts={categoryCounts}
            />
          </div>

          {/* Global controls */}
          <div className="flex gap-2 sm:gap-3 mb-6 p-2 sm:p-3 glass rounded-xl border border-border/30 dark:border-border/50 text-xs sm:text-sm">
            <button
              onClick={selectAllVisible}
              className="font-semibold text-primary hover:underline"
            >
              Seleccionar todos
            </button>
            <span className="text-muted-foreground">·</span>
            <button
              onClick={deselectAllVisible}
              className="font-semibold text-muted-foreground hover:underline"
            >
              Deseleccionar todos
            </button>
            <span className="ml-auto font-semibold text-foreground whitespace-nowrap">
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

function ThemeToggle() {
  const [theme, toggle] = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Cambiar tema"
      title={theme === 'dark' ? 'Cambiar a claro' : 'Cambiar a oscuro'}
      className="p-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/20 transition"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}

export default Index;
