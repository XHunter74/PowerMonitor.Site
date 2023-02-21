import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionDialogDataDto } from '../../models/question-dialog-data.dto';

@Component({
    selector: 'app-dialog',
    templateUrl: './question-dialog.component.html',
    styleUrls: ['./question-dialog.component.css']
})
export class QuestionDialogComponent {

    static async show(dialog: MatDialog, question: string,
        positiveButton?: string, negativeButton?: string, width?: string): Promise<string> {
        if (!width) {
            width = '500px';
        }
        if (!positiveButton) {
            positiveButton = 'Yes';
        }
        if (!negativeButton) {
            negativeButton = 'No';
        }
        const dialogRef = dialog.open(QuestionDialogComponent, {
            width,
            data: new QuestionDialogDataDto(question, positiveButton, negativeButton)
        });
        const dialogResult = await dialogRef.afterClosed().toPromise();
        return dialogResult;
    }

    constructor(@Inject(MAT_DIALOG_DATA) public data: QuestionDialogDataDto) { }

}
