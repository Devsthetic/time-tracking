import { TimeEntry } from './time-entry';
import * as moment from 'moment';

export interface Day {
    id?: number;
    month?: number;
    name?: string;
    day?: number;
    dateString?: string;
    moment?: moment.Moment;
    native?: Date;
    year?: number;
    time?: TimeEntry[];
    totalTime?: number;
    editable?: boolean;
    createdOn?: string;
    updatedOn?: string;
}
