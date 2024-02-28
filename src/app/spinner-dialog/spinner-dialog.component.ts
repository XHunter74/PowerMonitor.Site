import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
