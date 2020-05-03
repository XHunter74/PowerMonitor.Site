import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuestionDialogDataDto } from '../../models/question-dialog-data.dto';

@Component({
    selector: 'app-dialog',
    templateUrl: './question-dialog.component.html',
    styleUrls: ['./question-dialog.component.css']
})
export class QuestionDialogComponent {

    static show(dialog: MatDialog, question: string,
                positiveButton?: string, negativeButton?: string, width?: string): MatDialogRef<QuestionDialogComponent> {
        if (!width) {
            width = '500px';
        }
        if (!positiveButton) {
            positiveButton = 'Yes';
        }
        if (!negativeButton) {
            negativeButton = 'No';
        }
        return dialog.open(QuestionDialogComponent, {
            width,
            data: new QuestionDialogDataDto(question, positiveButton, negativeButton)
        });
    }

    constructor(@Inject(MAT_DIALOG_DATA) public data: QuestionDialogDataDto) { }

}
