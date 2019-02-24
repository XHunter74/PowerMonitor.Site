import { Component, OnInit, OnDestroy } from '@angular/core';
import { ServicesService } from '../services/services-service';
import { IBoardInfoModel } from '../models/board-info.model';
import { ICalibrationCoefficients } from '../models/calibration-coefficients.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SpinnerDialogComponent } from '../spinner-dialog/spinner-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
    selector: 'app-real-data',
    templateUrl: './board-settings.component.html',
})


export class BoardSettingsComponent implements OnInit, OnDestroy {

    boardInfo: IBoardInfoModel;
    calibrationCoefficients: ICalibrationCoefficients;
    private dialogRef: MatDialogRef<SpinnerDialogComponent>;

    coefficientsForm = new FormGroup({
        voltageCoefficient: new FormControl('',
            [Validators.required]),
        currentCoefficient: new FormControl('',
            [Validators.required]),
        powerFactorCoefficient: new FormControl('',
            [Validators.required]),
    });

    constructor(private servicesService: ServicesService,
        private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.refreshData();
    }

    ngOnDestroy(): void {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }

    async refreshData() {
        setTimeout(() => {
            this.dialogRef = this.dialog.open(SpinnerDialogComponent, {
                panelClass: 'transparent',
                disableClose: true
            });
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
