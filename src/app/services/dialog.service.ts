import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    close = new Subject<boolean>();
    close$ = this.close.asObservable();
    confirm = new Subject<any>();
    confirm$ = this.confirm.asObservable();
    dialogError = new Subject<boolean>();
    dialogError$ = this.dialogError.asObservable();
    disableSubmit = new Subject<boolean>();
    disableSubmit$ = this.disableSubmit.asObservable();
    open = new Subject<string>();
    open$ = this.open.asObservable();

    constructor() {
        console.log('dls service start');
    }

    closeDialog(data: any): void {
        this.close.next(data);
    }

    continue(args: any): void {
        this.confirm.next(args);
    }

    openDialog(type: string): void {
        console.log('open dialog');
        this.open.next(type);
    }

    setError(error: boolean) {
        this.dialogError.next(error);
    }

    setDisableSubmit(disable: boolean) {
        this.disableSubmit.next(disable);
    }
}
