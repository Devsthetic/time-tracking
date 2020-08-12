import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '@services/dialog.service';
import { WindowService } from '@services/window.service';
import { Subscription } from 'rxjs';
import { TimeEntryComponent } from '@components/time-entry/time-entry.component';
import { DateService } from '@services/date.service';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, OnDestroy {
    data: any;
    disableSubmit: boolean;
    dialogError: boolean;
    subs: Subscription[] = [];

    constructor(
        private dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) data,
        public _dls: DialogService,
        public ds: DateService,
        public ws: WindowService
    ) {
        this.data = data;
    }

    ngOnInit(): void {
        this.subs.push(
            this._dls.dialogError$.subscribe(
                error => (this.dialogError = error)
            )
        );
        this.subs.push(
            this._dls.disableSubmit$.subscribe(
                disable => (this.disableSubmit = disable)
            )
        );
        this.subs.push(
            this._dls.confirm$.subscribe(args =>
                this.continue(args.continue, args.data)
            )
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach(s => s.unsubscribe());
    }

    continue(continueAction: boolean, args?: any): void {
        const data: any = args
            ? Object.assign({}, { continue: continueAction }, args)
            : { continue: continueAction };
        this.dialogRef.close(data);
    }
}
