import { Component, inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SpinnerDialogComponent } from '../spinner-dialog/spinner-dialog.component';
import { StringUtils } from '../utils';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';

@Component({
    template: ''
})
export class AppBaseComponent implements OnDestroy {

    private readonly dateAdapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
    protected dialogRef: MatDialogRef<SpinnerDialogComponent>;

    constructor(protected dialog: MatDialog, protected translate: TranslateService) {
        this.dateAdapter.setLocale(this.translate.currentLang);
        this.translate.onLangChange.subscribe(() => {
            this.dateAdapter.setLocale(this.translate.currentLang);
        });
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
