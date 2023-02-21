export class CalibrationCoefficients {
    voltageCalibration: number;
    currentCalibration: number;

    constructor(voltageCalibration: number, currentCalibration: number) {
        this.currentCalibration = currentCalibration;
        this.voltageCalibration = voltageCalibration;
    }
}
