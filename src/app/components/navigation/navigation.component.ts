import {
    Component,
    OnInit,
    OnDestroy,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { WindowService } from '@services/window.service';
import { AuthService } from '@services/auth.service';
import { Profile } from '@models';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit, OnChanges, OnDestroy {
    menuOpen: boolean;
    profile: Profile;
    subs: Subscription[];

    constructor(
        private rt: Router,
        private ar: ActivatedRoute,
        private ws: WindowService,
        private as: AuthService
    ) {
        this.menuOpen = false;
        this.subs = [];
        /* If we click a link we want the menu to auto close */
        this.subs.push(
            this.rt.events
                .pipe(filter(event => event instanceof NavigationEnd))
                .subscribe(() => {
                    this.menuOpen = false;
                })
        );
    }

    ngOnInit(): void {
        this.subs.push(
            this.as.authSub$.subscribe(profile => (this.profile = profile))
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['authenticated']) {
            if (changes['authenticated'].currentValue) {
                // What are we doing when the user is logged in
            } else {
                // What are we doing when they logout
            }
        }
    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
    }

    logout(): void {
        this.as.logout();
    }

    toggleMenu(): void {
        this.menuOpen = !this.menuOpen;
    }
}
