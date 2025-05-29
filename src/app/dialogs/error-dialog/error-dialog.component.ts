import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ErrorDialogData } from '../Models/error-dialog-data';

@Component({
    selector: 'app-error-dialog',
    templateUrl: './error-dialog.component.html',
    styleUrls: ['./error-dialog.component.css'],
    standalone: false
})
export class ErrorDialogComponent {
    static show(dialog: MatDialog, message: string, width?: string) {
        if (!width) {
            width = '430px';
        }
        dialog.open(ErrorDialogComponent, {
            width: width,
            height: '180px',
            data: new ErrorDialogData(message),
        });
    }

    constructor(@Inject(MAT_DIALOG_DATA) public data: ErrorDialogData) {}
}
