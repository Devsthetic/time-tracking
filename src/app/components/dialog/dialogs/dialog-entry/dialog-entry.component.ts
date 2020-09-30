import { Component, OnInit, Input } from '@angular/core';
import { Day, TimeEntry } from 'src/app/models';
import { TimeService } from '@services/time.service';
import { WindowService } from '@services/window.service';

@Component({
    selector: 'app-dialog-entry',
    templateUrl: './dialog-entry.component.html',
    styleUrls: ['./dialog-entry.component.scss'],
})
export class DialogEntryComponent implements OnInit {
    @Input() day: Day;
    data: TimeEntry[];
    emptyTime: TimeEntry;

    constructor(public ts: TimeService, public ws: WindowService) {}

    ngOnInit(): void {
        this.emptyTime = {
            id: null,
            date: null,
            timeCode: null,
            hours: null,
            profileId: null,
            createdOn: null,
            createdBy: null,
            updatedOn: null,
            updatedBy: null,
            editable: null,
            notes: null,
        };
        this.createData();
    }

    createData(): void {
        this.data = this.ts.codes.map(c => ({
            ...this.getTimeByCode(this.day.time, c.code),
            timeCode: c.code,
        }));
        console.log(this);
    }

    getTimeByCode(times: TimeEntry[], code: string): TimeEntry {
        const time = times.find(t => t.timeCode === code);
        return time || this.emptyTime;
    }
}
