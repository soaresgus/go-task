import { differenceInSeconds, differenceInMinutes, differenceInHours, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatElapsed(date: Date | string): string {
  const d = new Date(date);
  const secs = differenceInSeconds(new Date(), d);
  if (secs < 60) return `${secs}s`;

  const mins = differenceInMinutes(new Date(), d);
  if (mins < 60) return `${mins}m`;

  const hours = differenceInHours(new Date(), d);
  if (hours < 24) return `${hours}h`;

  return format(d, 'dd/MM/yyyy', { locale: ptBR });
}
