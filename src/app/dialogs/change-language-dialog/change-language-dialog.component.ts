import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionDialogDataDto } from '../../models/question-dialog-data.dto';

@Component({
    selector: 'app-dialog',
    templateUrl: './change-language-dialog.component.html',
    styleUrls: ['./change-language-dialog.component.css']
})
export class ChangeLanguageDialogComponent {

    static async show(dialog: MatDialog, width?: string): Promise<string> {
        if (!width) {
            width = '500px';
        }

        const dialogRef = dialog.open(ChangeLanguageDialogComponent, {
            width,
            height: '100px',
        });
        const dialogResult = await dialogRef.afterClosed().toPromise();
        return dialogResult;
    }

    constructor(@Inject(MAT_DIALOG_DATA) public data: QuestionDialogDataDto) { }

}
