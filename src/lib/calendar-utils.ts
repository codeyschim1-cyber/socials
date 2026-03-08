import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isSameDay,
  addMonths, subMonths, addWeeks, subWeeks, isToday, parseISO,
} from 'date-fns';

export function getCalendarDays(currentDate: Date): Date[] {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}

export function getWeekDays(currentDate: Date): Date[] {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  return eachDayOfInterval({ start: weekStart, end: weekEnd });
}

export function formatDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDisplayDate(date: Date): string {
  return format(date, 'MMMM yyyy');
}

export function formatWeekRange(date: Date): string {
  const start = startOfWeek(date);
  const end = endOfWeek(date);
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
}

export { isSameMonth, isSameDay, isToday, addMonths, subMonths, addWeeks, subWeeks, format, parseISO };
