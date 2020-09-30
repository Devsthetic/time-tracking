import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'dateTime',
})
export class DateTimePipe implements PipeTransform {
    transform(value: string): string {
        return moment(value).format('dddd, MMMM Do YYYY, h:mm A');
    }
}
