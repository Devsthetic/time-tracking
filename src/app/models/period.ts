import { Day } from './day';
import * as moment from 'moment';

export interface Period {
    startDate?: string | number | Date | moment.Moment;
    endDate?: string | number | Date | moment.Moment;
    days?: Day[];
}
