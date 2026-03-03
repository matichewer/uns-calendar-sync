import { CalendarEvent } from '@/utils/parseCalendar';

type Category = CalendarEvent['category'] | 'todos';

interface CategoryFilterProps {
  active: Category;
  onChange: (cat: Category) => void;
  counts: Record<string, number>;
}

const FILTERS: { key: Category; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'feriado', label: 'Feriados' },
  { key: 'nolaborable', label: 'No laborable' },
  { key: 'asueto', label: 'Asuetos' },
  { key: 'clases', label: 'Clases' },
  { key: 'general', label: 'General' },
];

export function CategoryFilter({ active, onChange, counts }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {FILTERS.map(({ key, label }) => {
        const isActive = active === key;
        const pillClass = key !== 'todos' && isActive ? `pill-${key}` : '';
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border-2 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 ${
              isActive && key === 'todos'
                ? 'bg-foreground text-primary-foreground dark:bg-muted dark:text-foreground border-foreground/50 dark:shadow-xl'
                : isActive
                ? `${pillClass} border-current/40 dark:border-current/50 dark:shadow-xl`
                : 'glass bg-secondary/50 text-muted-foreground hover:bg-accent hover:text-foreground border-border/30 dark:border-border/50 hover:border-border/60'
            }`}
          >
            {label}
            {key !== 'todos' && counts[key] !== undefined && (
              <span className="ml-1.5 opacity-90 font-bold">({counts[key]})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
