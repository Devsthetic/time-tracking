import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequestInterceptor } from './core/http/request-interceptors';
// import { RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
import { AuthService } from '@services/auth.service';
import { DateService } from '@services/date.service';
import { TimeService } from '@services/time.service';
import { WindowService } from '@services/window.service';
import { DialogService } from '@services/dialog.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export const AppProviders: any[] = [
    AuthService,
    DateService,
    TimeService,
    WindowService,
    DialogService,
    {
        provide: MAT_DIALOG_DATA,
        useValue: {},
    },
    {
        provide: MatDialogRef,
        useValue: {},
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: HttpRequestInterceptor,
        multi: true,
    },
];
