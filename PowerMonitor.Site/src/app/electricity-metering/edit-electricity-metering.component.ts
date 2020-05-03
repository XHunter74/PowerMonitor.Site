import { Component, Optional, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { PowerMeteringDto } from '../models/power-metering.dto';

@Component({
    selector: 'app-edit-electricity-metering',
    templateUrl: './edit-electricity-metering.component.html',
    styleUrls: ['./edit-electricity-metering.component.css'],
})


export class EditElectricityMeteringComponent {

    data: PowerMeteringDto;
    eventTime: Date;

    constructor(
        @Optional() @Inject(MAT_DIALOG_DATA) public componentData: PowerMeteringDto,
        @Optional() private readonly dialogRef: MatDialogRef<EditElectricityMeteringComponent>,
    ) {
        if (!componentData) {
            componentData = new PowerMeteringDto();
            componentData.eventDate = new Date();
        }
        this.data = componentData;
    }

    static show(dialog: MatDialog, data?: PowerMeteringDto): MatDialogRef<EditElectricityMeteringComponent> {
        return dialog.open(EditElectricityMeteringComponent, {
            width: '700px',
            maxHeight: '700px',
            data
        });
    }

    saveItem() {
        this.dialogRef.close(this.data);
    }
}
