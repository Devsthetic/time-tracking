import {
    Component,
    Input,
    Output,
    OnInit,
    AfterViewInit,
    OnChanges,
    OnDestroy,
    ViewChild,
    SimpleChanges,
    ChangeDetectorRef,
    EventEmitter,
} from '@angular/core';
import { TimeService } from '@services/time.service';
import { DateService } from '@services/date.service';
import { AuthService } from '@services/auth.service';
import { WindowService } from '@services/window.service';
import { Subscription } from 'rxjs';
import { Day, DateSelection, Profile, TimeCode, Period } from '@models';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent
    implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @Input() startDate: Date;
    @Input() endDate: Date;
    @Input() actions: boolean;
    @Input() card: boolean;
    @Input() view: boolean;
    @Input() search: Subscription;
    @Output() selectedDate = new EventEmitter<DateSelection>();
    @ViewChild(MatPaginator) paginator: MatPaginator;

    profile: Profile;
    timeForm: FormGroup;
    codes: TimeCode[];
    days: Day[];
    period: Period;
    subs: Subscription[];
    dataSource: MatTableDataSource<object>;
    displayedColumns: string[] = ['weekDay', 'date', 'code', 'time'];

    constructor(
        private rt: Router,
        private ar: ActivatedRoute,
        private ts: TimeService,
        private ds: DateService,
        private as: AuthService,
        public ws: WindowService,
        private cdr: ChangeDetectorRef
    ) {
        this.codes = [];
        this.subs = [];
        this.profile = this.as.getUser();
        this.getTimeCodes();
        if (!this.profile) {
            this.as.authSub$.subscribe(profile => (this.profile = profile));
        }
        this.ws.winResizeWidthSub$.subscribe(() => this.changeDisplayColumns());
    }

    ngOnInit(): void {
        if (this.actions) {
            console.log('has actions');
            this.pushColumns(['actions']);
        }
    }

    /* Wait for view to check display size */
    ngAfterViewInit(): void {
        this.changeDisplayColumns();
    }

    /* Actions for input changes */
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['view']) {
            console.log('changes view');
            if (changes['view'].currentValue) {
                if (this.startDate && this.endDate) {
                    this.getPeriod(this.startDate, this.endDate);
                }
            }
        }
        if (changes['actions']) {
            console.log('changes actions');
            if (changes['actions'].currentValue) {
                this.pushColumns(['actions']);
            } else {
                this.removeColumns(['actions']);
            }
        }
    }

    /* Clear memeory of subs on destroy */
    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
    }

    /* Small screen size removes unnecessary columns */
    changeDisplayColumns(): void {
        if (this.ws.width < 500) {
            this.removeColumns(['weekDay', 'code']);
        } else {
            this.pushColumns(['weekDay', 'code']);
        }
    }

    /* Emits selected date */
    emit(action: string, dt: string | number | Date): void {
        this.selectedDate.emit({ action: action, date: dt, type: 'moment' });
    }

    getPeriod(sD: Date, eD: Date): void {
        if (sD && eD) {
            const period = this.ds.getPeriod(sD, eD);
            this.subs.push(
                this.ts
                    .getTimeByPeriod(
                        this.as.getUser().id,
                        sD.getTime(),
                        eD.getTime()
                    )
                    .subscribe(
                        res => {
                            period.days = this.ds.getTimeEntries(
                                period.days,
                                res
                            );
                            this.setPeriod(period);
                        },
                        err => {
                            this.setPeriod(period);
                            console.log(err);
                        }
                    )
            );
        }
    }

    /* Gets codes used to display in form */
    getTimeCodes(): void {
        this.subs.push(
            this.ts.getTimeCodes().subscribe(
                codes => {
                    this.codes = codes;
                },
                err => {
                    console.log(err);
                }
            )
        );
    }

    /* Gets the total cost of all transactions. */
    getTotalHours(): number {
        return this.period.days
            .map(d => d.totalTime)
            .reduce((acc, value) => acc + value, 0);
    }

    /* Adds columns to table */
    pushColumns(keys: string[]): void {
        keys.forEach(key => {
            const aIdx = this.displayedColumns.indexOf(key);
            if (aIdx === -1) {
                this.displayedColumns.push(key);
            }
        });
    }

    /* Removes columns from table */
    removeColumns(keys: string[]): void {
        keys.forEach(key => {
            const aIdx = this.displayedColumns.indexOf(key);
            if (aIdx > -1) {
                this.displayedColumns.splice(aIdx, 1);
            }
        });
    }

    setPeriod(period: Period): void {
        this.period = period;
        this.dataSource = new MatTableDataSource(this.period.days);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
    }
}
