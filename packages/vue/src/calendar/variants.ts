export type CalendarSize = 'sm' | 'md' | 'lg';

export interface CalendarProps {
  modelValue?: Date | null;
  defaultValue?: Date | null;
  month?: Date;
  defaultMonth?: Date;
  min?: Date;
  max?: Date;
  size?: CalendarSize;
  weekStartsOn?: 0 | 1;
  showWeekNumbers?: boolean;
  disabled?: boolean;
  className?: string;
}

export interface DayCell {
  date: Date;
  iso: string;
  inMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  weekNumber: number;
}

const WEEKDAYS_SUN = ['日', '一', '二', '三', '四', '五', '六'];
const WEEKDAYS_MON = ['一', '二', '三', '四', '五', '六', '日'];

export function weekdayLabels(weekStartsOn: 0 | 1): string[] {
  return weekStartsOn === 0 ? WEEKDAYS_SUN : WEEKDAYS_MON;
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function toIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getWeekNumber(d: Date): number {
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
}

export function buildMonthGrid(month: Date, weekStartsOn: 0 | 1): DayCell[] {
  const first = startOfMonth(month);
  const firstDow = first.getDay();
  const offset = (firstDow - weekStartsOn + 7) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - offset);
  const today = new Date();
  const cells: DayCell[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dow = d.getDay();
    cells.push({
      date: d,
      iso: toIso(d),
      inMonth: d.getMonth() === month.getMonth(),
      isToday: isSameDay(d, today),
      isWeekend: dow === 0 || dow === 6,
      weekNumber: getWeekNumber(d),
    });
  }
  return cells;
}

export function calendarClass(p: {
  size: CalendarSize;
  showWeekNumbers: boolean;
  disabled: boolean;
  className?: string;
}): string {
  return [
    'cf-cal',
    `cf-cal--${p.size}`,
    p.showWeekNumbers && 'has-weeknums',
    p.disabled && 'is-disabled',
    p.className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function isOutOfRange(d: Date, min?: Date, max?: Date): boolean {
  if (min && d < startOfDay(min)) return true;
  if (max && d > endOfDay(max)) return true;
  return false;
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}
