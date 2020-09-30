import * as moment from 'moment';
export interface WorkDay {
    id?: number;
    date?: string;
    moment?: moment.Moment;
    timesheetid?: string;
    timetype?: string;
    employeeid?: string;
    created?: Date;
    updated?: Date;
    timeid?: string;
    hours?: number;
    day?: string;
}
