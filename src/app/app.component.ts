import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { WindowService } from '@services/window.service';
import { DialogComponent } from '@components/dialog/dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogService } from '@services/dialog.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    _auth: boolean;
    _authCheck: boolean;
    _subs: Subscription[];

    constructor(
        private as: AuthService,
        private rt: Router,
        private ds: DialogService,
        public ws: WindowService,
        public dialog: MatDialog
    ) {
        this._subs = [];
        // if profile returned user is authenticted
        this._subs.push(
            this.as.authSub$.subscribe(profile => {
                if (profile) {
                    this._auth = true;
                }
            })
        );
        // Grab and store previous route on navigation
        this._subs.push(
            this.rt.events
                .pipe(filter(event => event instanceof NavigationEnd))
                .subscribe(() => {
                    localStorage.setItem('prvRt', this.rt.url);
                })
        );
        // Check for localStorage credentials
        this.checkAuth();
    }

    ngOnInit(): void {
        this._subs.push(this.ds.open$.subscribe(type => this.openDialog(type)));
        this._subs.push(this.ds.close$.subscribe(() => this.closeDialog()));
    }

    ngOnDestroy(): void {
        this._subs.forEach(s => s.unsubscribe());
    }

    checkAuth(): void {
        if (
            !!localStorage.getItem('usr') &&
            !this.as.isLoggedIn() &&
            this.rt.url.length > 0
        ) {
            const prvRt = localStorage.getItem('prvRt');
            this.as.login(JSON.parse(localStorage.getItem('usr')), prvRt);
            this._auth = true;
        } else {
            localStorage.clear();
        }
        // no view in tmeplate until auth checked
        this._authCheck = true;
    }

    closeDialog(): void {
        this.dialog.closeAll();
    }

    openDialog(type: string): void {
        console.log('open dialog');
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.closeOnNavigation = false;
        dialogConfig.data = {
            dialogType: type,
        };

        if (this.ws.width > 720) {
            dialogConfig.width = '600px';
        } else {
            dialogConfig.width = '80vw';
        }

        const dialogRef = this.dialog.open(DialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(data => {
            if (data.continue) {
                console.log('save or continue');
                console.log(data);
            }
        });
    }
}
