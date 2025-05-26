import { Component, Optional, Inject, OnInit } from '@angular/core';
import { PowerMeteringDto } from '../../models/power-metering.dto';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-edit-power-consumption',
    templateUrl: './edit-power-consumption.component.html',
    styleUrls: ['./edit-power-consumption.component.css'],
})
export class EditPowerConsumptionComponent implements OnInit {
    data: PowerMeteringDto;
    eventTime: { hour: number; minute: number };
    recordForm = new UntypedFormGroup({
        eventDateField: new UntypedFormControl('', [Validators.required]),
        eventTimeField: new UntypedFormControl('', [Validators.required]),
        factualDataField: new UntypedFormControl('', [Validators.required]),
    });

    constructor(
        @Optional() @Inject(MAT_DIALOG_DATA) public componentData: PowerMeteringDto,
        @Optional() private readonly dialogRef: MatDialogRef<EditPowerConsumptionComponent>,
    ) {
        if (!componentData) {
            componentData = new PowerMeteringDto();
            componentData.eventDate = new Date();
        }
        this.data = componentData;
        this.eventTime = {
            hour: this.data.eventDate.getHours(),
            minute: this.data.eventDate.getMinutes(),
        };
    }

    static async show(dialog: MatDialog, data?: PowerMeteringDto): Promise<PowerMeteringDto> {
        const dialogRef = dialog.open(EditPowerConsumptionComponent, {
            width: '400px',
            maxHeight: '700px',
            height: '430px',
            data,
        });
        const dialogData = (await firstValueFrom(dialogRef.afterClosed())) as PowerMeteringDto;
        return dialogData;
    }

    ngOnInit(): void {
        this.recordForm.patchValue({
            eventDateField: this.data.eventDate,
            eventTimeField: this.eventTime,
            factualDataField: this.data.factualData,
        });
    }

    saveItem() {
        let eventDate: Date;
        try {
            eventDate = this.eventDateField.value.toDate();
        } catch {
            eventDate = this.eventDateField.value;
        }
        const eventTime = this.eventTimeField.value as { hour: number; minute: number };
        eventDate.setHours(eventTime.hour);
        eventDate.setMinutes(eventTime.minute);
        this.data.eventDate = eventDate;
        const factualData = Number(this.factualDataField.value);
        this.data.factualData = factualData;
        this.dialogRef.close(this.data);
    }

    get eventDateField() {
        return this.recordForm.get('eventDateField');
    }
    get eventTimeField() {
        return this.recordForm.get('eventTimeField');
    }
    get factualDataField() {
        return this.recordForm.get('factualDataField');
    }
}
