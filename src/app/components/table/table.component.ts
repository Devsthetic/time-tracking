import { Component, Input, Output, OnInit, AfterViewInit, OnChanges, OnDestroy, ViewChild, SimpleChanges, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { TimeService } from '@services/time.service';
import { DateService }  from '@services/date.service';
import { AuthService }  from '@services/auth.service';
import { WindowService } from '@services/window.service';
import { Observable, Subscription, timer } from 'rxjs';
import { Month, Day, Profile, TimeCode, Period } from '@models';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { DateSelection } from '@models';
import * as moment from 'moment';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @Input() startDate: any;
  @Input() endDate: any;
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

  constructor(private rt: Router,
    private ar: ActivatedRoute,
    private ts: TimeService,
    private ds: DateService,
    private as: AuthService,
    public ws: WindowService,
    private cdr: ChangeDetectorRef) {
    this.codes = [];
    this.subs = [];
    this.profile = this.as.getUser();
    this.getTimeCodes();
    if(!this.profile) { this.as.authSub$.subscribe(profile=> this.profile = profile) }
    this.ws.winResizeWidthSub$.subscribe(()=> this.changeDisplayColumns());
  }

  ngOnInit() {
    if(this.actions) {
      console.log('has actions')
      this.pushColumns(['actions']);
    }
  }

  ngAfterViewInit() {
    this.changeDisplayColumns();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['view']) {
      console.log('changes view')
      if(changes['view'].currentValue) {
        if(this.startDate && this.endDate) {
          this.getPeriod(this.startDate, this.endDate);
        }
      }
    }
    if(changes['actions']) {
      console.log('changes actions')
      if(changes['actions'].currentValue) {
        this.pushColumns(['actions']);
      } else {
        this.removeColumns(['actions']);
      }
    }
  }

  /* Clear memeory of subs on destroy */
  ngOnDestroy() {
    this.subs.forEach(s=> s.unsubscribe());
  }

  changeDisplayColumns() {
    if(this.ws.width < 500) {
      this.removeColumns(['weekDay', 'code']);
    } else {
      this.pushColumns(['weekDay', 'code']);
    }
  }

  emit(action: string, dt: any) {
    this.selectedDate.emit({action: action, date: dt, type: 'moment'});
  }

  getPeriod(sD: any, eD: any) {
    console.log('get period');
    console.log(sD)
    console.log(eD)
    if(sD && eD && moment.isMoment(sD) && moment.isMoment(eD) && sD.isValid() && eD.isValid() && sD != eD) {
      this.subs.push(this.ts.getTimeByPeriod(this.as.getUser().id, sD.format('x'), eD.format('x'))
      .subscribe(res=> {
        console.log('returned')
        let period = this.ds.getPeriod(sD, eD);
        console.log(period)
        period.days = this.ds.getTimeEntries(period.days, res);
        console.log(period.days)
        this.period = period;
        this.dataSource = new MatTableDataSource(this.period.days);
        this.cdr.detectChanges();
        this.dataSource.paginator = this.paginator;
      }, err=> {
        console.log('returned')
        console.log(err)
      }));
     }
  }

  getTimeCodes() {
    this.subs.push(this.ts.getTimeCodes()
    .subscribe(codes=> { this.codes = codes }, err => { console.log(err) }));
  }

  /** Gets the total cost of all transactions. */
  getTotalHours() {
    return this.period.days.map(d => d.totalTime).reduce((acc, value) => acc + value, 0);
  }

  pushColumns(keys: string[]) {
    keys.forEach(key=> {
      let aIdx = this.displayedColumns.indexOf(key);
      if(aIdx === -1) this.displayedColumns.push(key);
    });
  }

  removeColumns(keys: string[]) {
    keys.forEach(key=> {
      let aIdx = this.displayedColumns.indexOf(key);
      if(aIdx > -1) this.displayedColumns.splice(aIdx, 1);
    });
  }
}
