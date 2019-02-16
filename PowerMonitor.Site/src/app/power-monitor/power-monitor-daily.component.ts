import { Component } from '@angular/core';

import { PowerService } from '../services/power-service';
import { IPowerDataModel } from '../models/power-data.model';

@Component({
    selector: 'app-power-monitor',
    templateUrl: './power-monitor-daily.component.html'
})
export class PowerMonitorDailyComponent {

    public powerData: IPowerDataModel[];
    public powerSum: number;

    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[] = [];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    public barChartData: any[] = [
        { data: [], label: 'Power, kW/h' }
    ];

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    constructor(private powerService: PowerService) {
        this.refreshData();
    }

    async refreshData() {
        try {
            const startDate = new Date();
            const finishDate = new Date();
            this.powerData = await this.powerService.getPowerData(startDate, finishDate);
            this.prepareChart(this.powerData);
            this.powerSum = 0;
            for (let record of this.powerData) {
                this.powerSum = this.powerSum + record.power;
            }
            this.powerSum = Math.round(this.powerSum * 100) / 100;
        } catch (e) {
            console.log(e);
            alert('Something going wrong!');
        }
    }

    prepareChart(data: IPowerDataModel[]) {
        let chartData: number[] = [];
        let chartLabels: string[] = [];
        if (data.length < 24) {
            for (var i = 0; i < 24; i++) {
                chartData.push(0);
                chartLabels.push((i).toString());
            }
            for (let record of data) {
                chartData[record.hours] = record.power;
            }
        } else {
            chartData = data.map(e => {
                return e.power;
            });
            chartLabels = data.map(e => {
                return e.hours.toString();
            });
        }
        this.barChartData[0].data = chartData;
        this.barChartLabels = chartLabels;
    }

    
}

