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
    eventTime: { hour: number; minute: number; };

    constructor(
        @Optional() @Inject(MAT_DIALOG_DATA) public componentData: PowerMeteringDto,
        @Optional() private readonly dialogRef: MatDialogRef<EditElectricityMeteringComponent>,
    ) {
        if (!componentData) {
            componentData = new PowerMeteringDto();
            componentData.eventDate = new Date();
        }
        this.data = componentData;
        this.eventTime = { hour: this.data.eventDate.getHours(), minute: this.data.eventDate.getMinutes() };
    }

    static show(dialog: MatDialog, data?: PowerMeteringDto): MatDialogRef<EditElectricityMeteringComponent> {
        return dialog.open(EditElectricityMeteringComponent, {
            width: '700px',
            maxHeight: '700px',
            data
        });
    }

    saveItem() {
        const eventDate = this.data.eventDate;
        eventDate.setHours(this.eventTime.hour);
        eventDate.setMinutes(this.eventTime.minute);
        this.data.eventDate = eventDate;
        this.dialogRef.close(this.data);
    }
}
