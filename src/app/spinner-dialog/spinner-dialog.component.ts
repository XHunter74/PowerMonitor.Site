import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-spinner-dialog',
  templateUrl: './spinner-dialog.component.html',
  styleUrls: ['./spinner-dialog.component.css']
})
export class SpinnerDialogComponent {

  public message: string;

  constructor(@Inject(MAT_DIALOG_DATA) data?: string) {
    if (data && data !== '') {
      this.message = data;
    } else {
      this.message = 'Loading...';
    }
  }

}
