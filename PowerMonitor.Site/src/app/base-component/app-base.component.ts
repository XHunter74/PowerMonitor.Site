import { OnDestroy } from '@angular/core';
import { SpinnerDialogComponent } from '../spinner-dialog/spinner-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { StringUtils } from '../utils';

export class AppBaseComponent implements OnDestroy {

    protected dialogRef: MatDialogRef<SpinnerDialogComponent>;

    constructor(private dialog: MatDialog) {

    }

    ngOnDestroy(): void {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }

    public formatNumber(value: number): string {
        return StringUtils.formatNumber(value);
    }

    showSpinner() {
        this.dialogRef = this.dialog.open(SpinnerDialogComponent, {
            panelClass: 'transparent',
            disableClose: true
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
