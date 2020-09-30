import * as moment from 'moment';

export interface TimeEntry {
    id?: number;
    date?: string | number | Date | moment.Moment;
    timeCode?: string;
    hours?: number;
    profileId?: number;
    createdOn?: string;
    createdBy?: number;
    updatedOn?: string;
    updatedBy?: number;
    editable?: boolean;
    notes?: string;
}
