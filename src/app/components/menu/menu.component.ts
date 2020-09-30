import { Component, OnInit, OnDestroy } from '@angular/core';
import { WindowService } from '@services/window.service';
import { AuthService } from '@services/auth.service';
import { Profile } from '@models';
import { Observable, Subscription } from 'rxjs';
import {
    Router,
    ActivatedRoute,
    NavigationExtras,
    NavigationEnd,
} from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
    menuOpen: boolean;
    profile: Profile;
    subs: Subscription[];

    constructor(
        private rt: Router,
        private ar: ActivatedRoute,
        private ws: WindowService,
        private as: AuthService
    ) {}

    ngOnInit(): void {
        this.subs = [];
        this.subs.push(
            this.as.authSub$.subscribe(profile => (this.profile = profile))
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
    }

    toggleMenu(): void {
        this.menuOpen = !this.menuOpen;
    }
}
