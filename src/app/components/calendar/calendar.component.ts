import { Component, OnDestroy } from '@angular/core';
import { TimeService } from '@services/time.service';
import { DateService } from '@services/date.service';
import { AuthService } from '@services/auth.service';
import { WindowService } from '@services/window.service';
import { DialogService } from '@services/dialog.service';
import { Subscription } from 'rxjs';
import { Month, Day, Profile } from '@models';
import * as moment from 'moment';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnDestroy {
    profile: Profile;
    month: Month;
    activeMonth: Month;
    today: Day;
    subs: Subscription[] = [];

    constructor(
        private ts: TimeService,
        private ds: DateService,
        private as: AuthService,
        public dls: DialogService,
        public ws: WindowService
    ) {
        this.today = this.ds.today();
        this.profile = this.as.getUser();
        if (!this.profile) {
            this.as.authSub$.subscribe(profile => {
                this.profile = profile;
                this.getThisMonth();
            });
        } else {
            this.getThisMonth();
        }
    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
    }

    getLastMonth(): void {
        const lm = moment(this.month.days[15].dateString)
            .subtract(1, 'M')
            .format('YYYY-MM-DD');
        this.activeMonth = this.ds.getCalendarMonth(lm);
        this.setMonth(this.activeMonth);
    }

    getNextMonth(): void {
        const nm = moment(this.month.days[15].dateString)
            .add(1, 'M')
            .format('YYYY-MM-DD');
        this.activeMonth = this.ds.getCalendarMonth(nm);
        this.setMonth(this.activeMonth);
    }

    getThisMonth(): void {
        this.month = this.ds.getCalendarMonth(moment().format('YYYY-MM-DD'));
        this.setMonth(this.month);
        this.activeMonth = this.month;
    }

    isToday(obj1: Day, obj2: Day): boolean {
        return (
            obj1.day === obj2.day &&
            obj1.year === obj2.year &&
            obj1.month === obj2.month
        );
    }

    isThisMonth(): boolean {
        const today: Day = this.ds.populateDay(moment(new Date()));
        return this.month.year === today.year && this.month.id === today.month;
    }

    setMonth(month: Month): void {
        this.subs.push(
            this.ts
                .getTimeByPeriod(
                    this.profile.id,
                    month.days[0].moment.valueOf(),
                    month.days[month.days.length - 1].moment.valueOf()
                )
                .subscribe(
                    res => {
                        const mm = month;
                        mm.days = this.ds.getTimeEntries(mm.days, res);
                        this.month = mm;
                    },
                    err => {
                        this.month = month;
                        console.log(err);
                    }
                )
        );
    }

    setActiveDay(day: Day): void {
        this.ds.setActiveDay(day);
        this.dls.openDialog('day');
    }
}
