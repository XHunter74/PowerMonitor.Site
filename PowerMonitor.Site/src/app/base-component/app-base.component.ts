import { OnDestroy } from '@angular/core';
import { SpinnerDialogComponent } from '../spinner-dialog/spinner-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { StringUtils } from '../utils';

// TODO: Add Angular decorator.
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
