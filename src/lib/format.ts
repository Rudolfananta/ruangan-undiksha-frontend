import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export function isoToHuman(date: string) {
    return format(date, 'EEEE, dd MMMM yyyy', { locale: id });
}