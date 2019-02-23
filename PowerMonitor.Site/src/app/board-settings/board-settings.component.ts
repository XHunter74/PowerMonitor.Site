import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services/services-service';
import { IBoardInfoModel } from '../models/board-info.model';
import { ICalibrationCoefficients } from '../models/calibration-coefficients.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-real-data',
    templateUrl: './board-settings.component.html',
})


export class BoardSettingsComponent implements OnInit {

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

    constructor(private servicesService: ServicesService) {

    }

    ngOnInit(): void {
        this.refreshData();
    }

    async refreshData() {
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
        }
    }

    changeCoefficients() {

    }

    get voltageCoefficient() { return this.coefficientsForm.get('voltageCoefficient'); }
    get currentCoefficient() { return this.coefficientsForm.get('currentCoefficient'); }
    get powerFactorCoefficient() { return this.coefficientsForm.get('powerFactorCoefficient'); }
}
