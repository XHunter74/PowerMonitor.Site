import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ErrorDialogData } from './Models/error-dialog-data';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
})
export class ErrorDialogComponent {

  static show(dialog: MatDialog, message: string, width?: string) {
    if (!width) {
      width = '350px';
    }
    dialog.open(ErrorDialogComponent, {
      width: width,
      data: new ErrorDialogData(message)
    });
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: ErrorDialogData) { }

}
