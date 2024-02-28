import { Component, OnDestroy } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { SpinnerDialogComponent } from '../spinner-dialog/spinner-dialog.component';
import { StringUtils } from '../utils';

@Component({
    template: ''
})
export class AppBaseComponent implements OnDestroy {

    protected dialogRef: MatDialogRef<SpinnerDialogComponent>;

    constructor(protected dialog: MatDialog) {

    }

    ngOnDestroy(): void {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }

    public formatNumber(value: number): string {
        return StringUtils.formatNumber(value);
    }

    showSpinner(message?: string) {
        if (!message) {
            message = '';
        }
        this.dialogRef = this.dialog.open(SpinnerDialogComponent, {
            panelClass: 'transparent',
            disableClose: true,
            data: message
        });
    }

    closeSpinner() {
        if (this.dialogRef) {
            this.dialogRef.close();
        } else {
            console.error('dialog is undefined');
        }
    }
}
