import { CalendarEvent } from './parseCalendar';

function nextDay(dateStr: string): string {
  const y = parseInt(dateStr.substring(0, 4));
  const m = parseInt(dateStr.substring(4, 6)) - 1;
  const d = parseInt(dateStr.substring(6, 8));
  const next = new Date(y, m, d + 1);
  return `${next.getFullYear()}${String(next.getMonth() + 1).padStart(2, '0')}${String(next.getDate()).padStart(2, '0')}`;
}

const CATEGORY_LABELS: Record<string, string> = {
  feriado: 'Feriado',
  nolaborable: 'No laborable',
  asueto: 'Asueto',
  clases: 'Clases',
  general: 'General',
};

export function generateICS(events: CalendarEvent[]): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UNS Calendario//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:UNS Académico',
    'X-WR-TIMEZONE:America/Argentina/Buenos_Aires',
  ];

  for (const ev of events) {
    lines.push(
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${ev.date}`,
      `DTEND;VALUE=DATE:${nextDay(ev.date)}`,
      `SUMMARY:${escapeICS(ev.title)}`,
      `DESCRIPTION:${CATEGORY_LABELS[ev.category] || 'Otro'} — Fuente: UNS`,
      `UID:${ev.id}@uns-calendario`,
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function escapeICS(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export function downloadICS(events: CalendarEvent[]) {
  const content = generateICS(events);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'calendario-uns.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
