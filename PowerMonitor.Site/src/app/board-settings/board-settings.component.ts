import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServicesService } from '../services/services-service';
import { IBoardInfoModel } from '../models/board-info.model';
import { ICalibrationCoefficients } from '../models/calibration-coefficients.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AppBaseComponent } from '../base-component/app-base.component';

@Component({
    selector: 'app-real-data',
    templateUrl: './board-settings.component.html',
})


export class BoardSettingsComponent extends AppBaseComponent implements OnInit, OnDestroy {

    boardInfo: IBoardInfoModel;
    calibrationCoefficients: ICalibrationCoefficients;

    coefficientsForm = new FormGroup({
        voltageCoefficient: new FormControl('',
            [Validators.required]),
        currentCoefficient: new FormControl('',
            [Validators.required]),
        powerFactorCoefficient: new FormControl('',
            [Validators.required]),
    });

    constructor(private servicesService: ServicesService,
        dialog: MatDialog) {
        super(dialog);
    }

    ngOnInit(): void {
        this.refreshData();
    }

    async refreshData() {
        setTimeout(() => {
            this.showSpinner()
        });
        try {
            this.boardInfo = await this.servicesService.getBoardVersion();
            this.calibrationCoefficients = await this.servicesService.getCalibrationCoefficients();
            this.coefficientsForm.patchValue({
                voltageCoefficient: this.calibrationCoefficients.voltageCalibration,
                currentCoefficient: this.calibrationCoefficients.currentCalibration,
                powerFactorCoefficient: this.calibrationCoefficients.powerFactorCalibration
            });
        } catch (e) {
            alert('Something going wrong!');
        } finally {
            this.dialogRef.close();
        }
    }

    changeCoefficients() {

    }

    get voltageCoefficient() { return this.coefficientsForm.get('voltageCoefficient'); }
    get currentCoefficient() { return this.coefficientsForm.get('currentCoefficient'); }
    get powerFactorCoefficient() { return this.coefficientsForm.get('powerFactorCoefficient'); }
}
