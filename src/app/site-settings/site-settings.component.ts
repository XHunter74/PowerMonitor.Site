import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServicesService } from '../services/services-service';
import { IBoardInfoModel } from '../models/board-info.model';
import { CalibrationCoefficients } from '../models/calibration-coefficients.model';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-site-settings',
    templateUrl: './site-settings.component.html',
})


export class SiteSettingsComponent extends AppBaseComponent implements OnInit, OnDestroy {

    boardInfo: IBoardInfoModel;
    newSketch: File;

    coefficientsForm = new UntypedFormGroup({
        voltageCoefficient: new UntypedFormControl('',
            [Validators.required]),
        currentCoefficient: new UntypedFormControl('',
            [Validators.required])
    });

    constructor(private servicesService: ServicesService,
        dialog: MatDialog,
        translate: TranslateService) {
        super(dialog, translate);
    }

    ngOnInit(): void {
        this.refreshData();
    }

    async refreshData() {
        setTimeout(() => {
            this.showSpinner();
        });
        try {
            this.boardInfo = await this.servicesService.getBoardVersion();
            const calibrationCoefficients = await this.servicesService.getCalibrationCoefficients();
            this.coefficientsForm.patchValue({
                voltageCoefficient: calibrationCoefficients.voltageCalibration,
                currentCoefficient: calibrationCoefficients.currentCalibration,
            });
            this.closeSpinner();
        } catch (e) {
            this.closeSpinner();
            console.error(e);
            const errorText = await this.translate.get('ERRORS.COMMON').toPromise();
            setTimeout(() => ErrorDialogComponent.show(this.dialog, errorText));
        }
    }

    async changeCoefficients() {
        setTimeout(() => {
            this.showSpinner();
        });
        try {
            const calibrationCoefficients = new CalibrationCoefficients(this.voltageCoefficient.value, this.currentCoefficient.value);
            await this.servicesService.setCalibrationCoefficients(calibrationCoefficients);
        } catch (e) {
            console.error(e);
            const errorText = await this.translate.get('ERRORS.COMMON').toPromise();
            setTimeout(() => ErrorDialogComponent.show(this.dialog, errorText));
        } finally {
            this.closeSpinner();
        }
    }

    fileChangeEvent(fileInput: any) {
        this.newSketch = <File>fileInput.target.files[0];
    }

    async uploadNewSketch() {
        this.showSpinner();
        try {
            await this.servicesService.uploadNewSketch(this.newSketch);
        } catch (e) {
            console.error(e);
            const errorText = await this.translate.get('ERRORS.COMMON').toPromise();
            setTimeout(() => ErrorDialogComponent.show(this.dialog, errorText));
        } finally {
            this.dialogRef.close();
        }
    }

    get voltageCoefficient() { return this.coefficientsForm.get('voltageCoefficient'); }
    get currentCoefficient() { return this.coefficientsForm.get('currentCoefficient'); }
}
