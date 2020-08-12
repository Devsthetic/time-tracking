import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { TimeService } from '@services/time.service';
import { DateService } from '@services/date.service';
import { AuthService } from '@services/auth.service';
import { WindowService } from '@services/window.service';
import { Observable, Subscription, timer } from 'rxjs';
import { Month, Day, Profile, DateSelection } from '@models';
import {
    FormGroup,
    FormControl,
    Validators,
    ValidatorFn,
} from '@angular/forms';
import * as moment from 'moment';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
    profile: Profile;
    mgr: Profile;
    dept: any;
    subs: Subscription[];

    constructor(
        private ts: TimeService,
        private ds: DateService,
        private as: AuthService,
        public ws: WindowService
    ) {
        this.subs = [];
        this.profile = this.as.getUser();
        this.subs.push(
            this.as.authSub$.subscribe(profile => {
                this.profile = profile;
                this.getData();
            })
        );
    }

    ngOnInit(): void {
        if (this.profile) {
            this.getData();
        }
    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
    }

    getDepartment(): void {
        this.subs.push(
            this.ts.getDepartment(this.profile.departmentId).subscribe(
                dept => {
                    this.dept = dept;
                },
                err => {
                    console.log(err);
                }
            )
        );
    }

    getManager(): void {
        if (this.profile.managerId) {
            this.subs.push(
                this.as.getProfile(this.profile.managerId).subscribe(
                    mgr => {
                        this.mgr = mgr;
                    },
                    err => {
                        console.log(err);
                    }
                )
            );
        }
    }

    getData(): void {
        this.getDepartment();
        this.getManager();
    }
}
