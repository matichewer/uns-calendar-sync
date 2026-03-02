export type CalendarEvent = {
  id: string;
  date: string;          // YYYYMMDD
  dateFormatted: string;  // e.g. "lun 16 mar"
  title: string;
  category: 'feriado' | 'asueto' | 'nolaborable' | 'clases' | 'general';
};

const MONTH_MAP: Record<string, number> = {
  Enero: 1, Febrero: 2, Marzo: 3, Abril: 4, Mayo: 5, Junio: 6,
  Julio: 7, Agosto: 8, Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12,
};

const MONTH_ABBR = ['', 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DAY_NAMES = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

function detectCategory(text: string): CalendarEvent['category'] {
  const t = text.toUpperCase();
  if (t.includes('FERIADO')) return 'feriado';
  // "No laborable" is a distinct category from feriado
  if (t.includes('NO LABORABLE')) return 'nolaborable';
  if (t.includes('ASUETO')) return 'asueto';

  const tl = text.toLowerCase();
  // Clases: inscripción a materias, cursos de verano, cursos intensivos, receso
  if ((/inscrip/i.test(tl) && /mater/i.test(tl)) || /cursos? de verano/i.test(tl) || /cursos? intensiv/i.test(tl) || /receso/i.test(tl)) {
    return 'clases';
  }

  // Everything else falls into 'general'
  return 'general';
}

export function parseCalendarHTML(html: string): CalendarEvent[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Extract year
  const h3 = doc.querySelector('h3');
  let year = new Date().getFullYear();
  if (h3) {
    const m = h3.textContent?.match(/(\d{4})/);
    if (m) year = parseInt(m[1]);
  }

  const table = doc.querySelector('table.tabla_calendario');
  if (!table) return [];

  const events: CalendarEvent[] = [];
  let currentMonth = 0;

  const rows = table.querySelectorAll('tr');
  rows.forEach((tr) => {
    // Check for month header
    const th = tr.querySelector('th.columna_fecha');
    if (th) {
      const text = th.textContent?.trim() || '';
      for (const [name, num] of Object.entries(MONTH_MAP)) {
        if (text.includes(name)) {
          currentMonth = num;
          break;
        }
      }
      return;
    }

    const cells = tr.querySelectorAll('td');
    if (cells.length < 2) return;

    const dateCell = cells[0];
    if (!dateCell.classList.contains('celda_fecha')) return;

    const dateText = dateCell.textContent?.trim() || '';
    if (dateText.includes('A fijar') || !dateText) return;

    const dayMatch = dateText.match(/^(\d+)/);
    if (!dayMatch || !currentMonth) return;

    const day = parseInt(dayMatch[1]);
    const title = cells[1].textContent?.trim() || '';
    if (!title) return;

    const dateStr = `${year}${String(currentMonth).padStart(2, '0')}${String(day).padStart(2, '0')}`;
    const dateObj = new Date(year, currentMonth - 1, day);
    const dayName = DAY_NAMES[dateObj.getDay()];
    const dateFormatted = `${dayName} ${day} ${MONTH_ABBR[currentMonth]}`;

    events.push({
      id: `${dateStr}-${events.length}`,
      date: dateStr,
      dateFormatted,
      title,
      category: detectCategory(title),
    });
  });

  return events;
}

export function getMonthName(monthNum: number): string {
  const names = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return names[monthNum] || '';
}

export function getMonthFromDate(dateStr: string): number {
  return parseInt(dateStr.substring(4, 6));
}
