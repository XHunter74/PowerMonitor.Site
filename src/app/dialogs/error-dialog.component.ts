import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ErrorDialogData } from './Models/error-dialog-data';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css']
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
