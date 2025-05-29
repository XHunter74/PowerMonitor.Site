import { Component, inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SpinnerDialogComponent } from '../../dialogs/spinner-dialog/spinner-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';

@Component({
    template: '',
    standalone: false
})
export class AppBaseComponent implements OnDestroy {
    private readonly dateAdapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
    protected dialogRef: MatDialogRef<SpinnerDialogComponent>;

    constructor(
        protected dialog: MatDialog,
        protected translate: TranslateService,
    ) {
        if (!this.translate.currentLang) {
            this.translate.use('en'); // Set a default language, e.g., 'en'
        }
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

    showSpinner(message?: string) {
        if (!message) {
            message = '';
        }
        if (this.dialogRef) {
            return;
        }
        this.dialogRef = this.dialog.open(SpinnerDialogComponent, {
            panelClass: 'transparent',
            disableClose: true,
            data: message,
        });
        return this.dialogRef;
    }

    closeSpinner() {
        if (this.dialogRef) {
            this.dialogRef.close();
            this.dialogRef = null;
        }
    }
}
