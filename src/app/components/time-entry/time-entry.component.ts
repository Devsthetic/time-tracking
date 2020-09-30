import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { TimeService } from '@services/time.service';
import { DateService } from '@services/date.service';
import { AuthService } from '@services/auth.service';
import { WindowService } from '@services/window.service';
import { Subscription } from 'rxjs';
import { Day, Profile, TimeEntry, TimeCode } from '@models';
import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface TimeEntryData {
    hh?: number;
    mm?: number;
    timeCode?: string;
}
@Component({
    selector: 'app-time-entry',
    templateUrl: './time-entry.component.html',
    styleUrls: ['./time-entry.component.scss'],
})
export class TimeEntryComponent implements OnInit, OnChanges, OnDestroy {
    @Input() day: Day;
    @Input() readOnly: boolean;
    @Input() entry: TimeEntry;
    timeForm: FormGroup;
    subs: Subscription[] = [];
    user: Profile;
    err: boolean;
    codes: TimeCode[];

    constructor(
        private _ts: TimeService,
        private _as: AuthService,
        private _ds: DateService,
        public ws: WindowService
    ) {
        console.log(this);
    }

    ngOnInit(): void {
        this.user = this._as.getUser();
        this.codes = this._ts.codes;
        this.setupForm();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['day']?.currentValue !== changes['day']?.previousValue) {
            console.log(this.day);
            this.populateForm();
        }
    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
        this.timeForm = null;
    }

    populateForm(): void {
        if (this.entry && this.timeForm) {
            const timeArr = this.entry.hours.toString().split('.');
            const hhControl = this.timeForm.get('hh');
            const codeControl = this.timeForm.get('timeCode');
            hhControl.patchValue(parseInt(timeArr[0], 10));
            codeControl.patchValue(this.entry.timeCode);
            if (timeArr[1]) {
                const mmControl = this.timeForm.get('mm');
                mmControl.patchValue(
                    (parseInt(timeArr[1], 10) * 0.6).toPrecision(2)
                );
            }
        }
    }

    saveTime(entry: TimeEntry): void {
        this._ts.setTimeByDate(entry).subscribe(
            res => {
                console.log(res);
            },
            err => {
                console.log(err);
                this.err = true;
            }
        );
    }

    setupForm(): void {
        this.timeForm = new FormGroup({
            hh: new FormControl({ value: null, disabled: true }, [
                Validators.minLength(1),
                Validators.maxLength(2),
                Validators.pattern(/[0-9]/),
            ]),
            mm: new FormControl({ value: null, disabled: true }, [
                Validators.minLength(1),
                Validators.maxLength(2),
                Validators.pattern(/[0-9]/),
            ]),
            timeCode: new FormControl({ value: null, disabled: true }, [
                Validators.required,
                Validators.maxLength(3),
                Validators.minLength(3),
            ]),
        });
        this.populateForm();
        this.subs.push(
            this.timeForm.valueChanges.subscribe(value => {
                if (this.timeForm.valid) {
                    this.saveTime(this.setUpTimeEntry(value));
                } else {
                    console.log(this.timeForm);
                    console.log('invalid');
                }
            })
        );
    }

    setFormValue(res: TimeEntry): void {
        const timeString = res.hours.toString();
        const timeArr = timeString.split('.');
        const hh = timeArr[0].length ? parseInt(timeArr[0], 10) : 0;
        const mm = timeArr[1] ? parseInt(timeArr[1], 10) * 0.6 : 0;
        this.timeForm.patchValue({ hh: hh, mm: mm, timeCode: res.timeCode });
    }

    setUpTimeEntry(data: TimeEntryData): TimeEntry {
        return {
            date: this.day.dateString,
            timeCode: data.timeCode,
            hours: data.hh + data.mm / 60,
            profileId: this.user.id,
            updatedBy: this.user.id,
        };
    }
}
