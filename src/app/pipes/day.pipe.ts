import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'day',
})
export class DayPipe implements PipeTransform {
    transform(
        value: moment.Moment | string,
        mobile: boolean,
        momentFormat?: boolean
    ): string | unknown {
        if (momentFormat && moment.isMoment(value)) {
            return value.format('M/DD/YY');
        } else if (typeof value === 'string') {
            const dayRef: Record<string, unknown> = {
                Monday: 'Mon',
                Tuesday: 'Tue',
                Wednesday: 'Wed',
                Thursday: 'Thu',
                Friday: 'Fri',
                Saturday: 'Sat',
                Sunday: 'Sun',
            };
            if (mobile) {
                return dayRef[value];
            } else {
                return value;
            }
        } else {
            return null;
        }
    }
}
