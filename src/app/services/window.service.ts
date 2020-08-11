import { ApplicationRef, Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

function _window(): any {
    return window;
}

@Injectable({
    providedIn: 'root',
})

/* Keep a reference to the window as a sevice so we dont need to keep querying for it */
export class WindowService implements OnDestroy {
    mobile: boolean;
    touchDevice: boolean;
    smallScreen: boolean;
    window: any;
    width: number;

    winResizeWidth = new Subject<number>();
    winResizeWidthSub$ = this.winResizeWidth.asObservable();

    /* Function call destroys a listner after use */
    winScroll: Function;
    winResize: Function;

    constructor(private appRef: ApplicationRef) {
        this.window = _window();
        this.winScroll = this.window.window.addEventListener('scroll', () =>
            this.setVariables()
        );
        this.winResize = this.window.window.addEventListener('resize', () =>
            this.setVariables(true)
        );
        this.setVariables();
    }

    /* Clear memory of subscriptions */
    ngOnDestroy(): void {
        this.winScroll();
        this.winResize();
    }

    get nativeWindow(): any {
        return _window();
    }

    setVariables(resize?: boolean): void {
        /* Does a simple user Agent info test to determine if the user is on a mobile device */
        this.mobile =
            (/Mobi/.test(this.window.navigator.userAgent) &&
                this.window.innerWidth <= 1024) ||
            this.window.innerWidth < this.window.innerHeight
                ? true
                : false;
        /* Checks touch points to determine touchscreen - use for swiping menu if future */
        this.touchDevice =
            this.window.navigator.maxTouchPoints > 0 ||
            this.window.navigator.msMaxTouchPoints > 0
                ? true
                : false;
        this.width = this.window.innerWidth;
        this.smallScreen = this.width < 550 ? true : false;
        if (resize) {
            this.winResizeWidth.next(this.width);
        }
    }
}
