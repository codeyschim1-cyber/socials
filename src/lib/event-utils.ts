import {
  startOfMonth, endOfMonth, eachDayOfInterval, getDay, format,
} from 'date-fns';
import { ThriftEvent, ThriftEventInstance } from '@/types/calendar';
import { THRIFT_EVENTS } from '@/data/thrift-events';

function isInSeason(event: ThriftEvent, month: number): boolean {
  if (event.seasonStart == null || event.seasonEnd == null) return true;
  if (event.seasonStart <= event.seasonEnd) {
    return month >= event.seasonStart && month <= event.seasonEnd;
  }
  // Wraps around year end (e.g. Nov–Feb)
  return month >= event.seasonStart || month <= event.seasonEnd;
}

function getNthWeekdayOfMonth(
  year: number,
  month: number,
  dayOfWeek: number,
  weekOfMonth: number,
): Date | null {
  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(start);
  const days = eachDayOfInterval({ start, end });

  let count = 0;
  for (const d of days) {
    if (getDay(d) === dayOfWeek) {
      count++;
      if (count === weekOfMonth) return d;
    }
  }
  return null;
}

export function getEventsForMonth(currentDate: Date, customEvents: ThriftEvent[] = []): ThriftEventInstance[] {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-indexed
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const instances: ThriftEventInstance[] = [];

  for (const event of THRIFT_EVENTS) {
    if (!isInSeason(event, month)) continue;

    const { recurrence } = event;

    if (recurrence.type === 'weekly') {
      const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
      for (const day of allDays) {
        if (getDay(day) === recurrence.dayOfWeek) {
          instances.push({ event, date: format(day, 'yyyy-MM-dd') });
        }
      }
    } else if (recurrence.type === 'monthly') {
      const target = getNthWeekdayOfMonth(year, month, recurrence.dayOfWeek, recurrence.weekOfMonth);
      if (target) {
        instances.push({ event, date: format(target, 'yyyy-MM-dd') });
      }
    } else if (recurrence.type === 'dates') {
      const prefix = format(monthStart, 'yyyy-MM');
      for (const d of recurrence.dates) {
        if (d.startsWith(prefix)) {
          instances.push({ event, date: d });
        }
      }
    }
  }

  // Merge custom events passed as parameter
  const prefix = format(monthStart, 'yyyy-MM');
  for (const event of customEvents) {
    if (event.recurrence.type === 'dates') {
      for (const d of event.recurrence.dates) {
        if (d.startsWith(prefix)) {
          instances.push({ event, date: d });
        }
      }
    }
  }

  instances.sort((a, b) => a.date.localeCompare(b.date));
  return instances;
}
