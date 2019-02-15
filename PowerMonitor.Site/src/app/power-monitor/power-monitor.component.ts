import { Component } from '@angular/core';
import { PowerService } from '../services/power-service';
import { IVoltageAmperageModel } from '../models/voltage-amperage.model';

@Component({
    selector: 'app-power-monitor',
    templateUrl: './power-monitor.component.html'
})
export class PowerMonitorComponent {

    public voltageData: IVoltageAmperageModel[];

    constructor(private powerService: PowerService) {
        this.refreshData();
    }

    async refreshData() {
        try {
            const currentDate = new Date();
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const finishDate = new Date(currentDate.getFullYear(), currentDate.getMonth(),
                daysInMonth(currentDate.getFullYear(), currentDate.getMonth() + 1));
            this.voltageData = await this.powerService.getVoltageAmperageData(startDate, finishDate);
        } catch (e) {
            alert('Something going wrong!');
        }
    }
}

function daysInMonth(year: number, month: number) {
    const days = new Date(year, month, 0).getDate();
    return days;
}

