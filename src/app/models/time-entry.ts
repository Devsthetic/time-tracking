import * as moment from 'moment';

export interface TimeEntry {
    id?: number;
    date?: string | number | Date | moment.Moment;
    timeCode?: string;
    hours?: number;
    profileId?: number;
    createdDate?: string;
    updateDate?: string;
    updaterId?: number;
    editable?: boolean;
    notes?: string;
}
