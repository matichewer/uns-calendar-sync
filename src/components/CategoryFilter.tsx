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
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(({ key, label }) => {
        const isActive = active === key;
        const pillClass = key !== 'todos' && isActive ? `pill-${key}` : '';
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              isActive && key === 'todos'
                  ? 'bg-foreground text-primary-foreground dark:bg-primary dark:text-primary-foreground'
                : isActive
                ? pillClass
                : 'bg-secondary text-muted-foreground hover:bg-accent'
            }`}
          >
            {label}
            {key !== 'todos' && counts[key] !== undefined && (
              <span className="ml-1 opacity-70">({counts[key]})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
