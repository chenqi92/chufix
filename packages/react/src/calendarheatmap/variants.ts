export interface HeatmapDay {
  date: string;
  value: number;
}

export interface CalendarHeatmapProps {
  data: HeatmapDay[];
  startDate?: string | Date;
  endDate?: string | Date;
  thresholds?: number[];
  className?: string;
}

export interface HeatmapCell {
  date: string;
  value: number;
  level: number;
  inRange: boolean;
}

export function calendarHeatmapClass(p: { className?: string }): string {
  return ['cf-heatmap', p.className].filter(Boolean).join(' ');
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function ymd(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseDate(d: string | Date): Date {
  if (d instanceof Date) return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return new Date(d);
}

export function buildCells(
  data: HeatmapDay[],
  startDate: string | Date | undefined,
  endDate: string | Date | undefined,
  thresholds: number[],
): { weeks: HeatmapCell[][]; months: { week: number; label: string }[] } {
  const today = new Date();
  const end = endDate ? parseDate(endDate) : new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let start: Date;
  if (startDate) {
    start = parseDate(startDate);
  } else {
    start = new Date(end);
    start.setFullYear(start.getFullYear() - 1);
    start.setDate(start.getDate() + 1);
  }

  const startOfWeek = new Date(start);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const map = new Map<string, number>();
  for (const d of data) map.set(d.date, d.value);

  const weeks: HeatmapCell[][] = [];
  const months: { week: number; label: string }[] = [];
  const monthLabels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  const cursor = new Date(startOfWeek);
  const endCursor = new Date(end);
  let lastMonth = -1;

  while (cursor <= endCursor) {
    const week: HeatmapCell[] = [];
    for (let dow = 0; dow < 7; dow++) {
      const date = new Date(cursor);
      const inRange = date >= start && date <= end;
      const dateStr = ymd(date);
      const value = map.get(dateStr) ?? 0;
      const level = inRange ? bucketLevel(value, thresholds) : 0;
      week.push({ date: dateStr, value, level, inRange });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);

    const firstDay = week[0].date;
    const m = parseDate(firstDay).getMonth();
    if (m !== lastMonth) {
      months.push({ week: weeks.length - 1, label: monthLabels[m] });
      lastMonth = m;
    }
  }

  return { weeks, months };
}

function bucketLevel(value: number, thresholds: number[]): number {
  if (value <= 0) return 0;
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (value >= thresholds[i]) return i + 1;
  }
  return 0;
}
