import { Component } from '@angular/core';
import { Sort } from '@angular/material';

import { PowerService } from '../services/power-service';
import { IVoltageAmperageModel } from '../models/voltage-amperage.model';
import { IPowerDataModel } from '../models/power-data.model';

@Component({
    selector: 'app-power-monitor',
    templateUrl: './power-monitor.component.html'
})
export class PowerMonitorComponent {

    public voltageData: IVoltageAmperageModel[];
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
            const currentDate = new Date();
            let startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            let finishDate = new Date(currentDate.getFullYear(), currentDate.getMonth(),
                daysInMonth(currentDate.getFullYear(), currentDate.getMonth() + 1));
            this.voltageData = await this.powerService.getVoltageAmperageData(startDate, finishDate);
            startDate = new Date();
            finishDate = new Date();
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
                chartLabels.push((i + 1).toString());
            }
            for (let record of data) {
                chartData[record.hours - 1] = record.power;
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

    sortData(sort: Sort) {
        const data = this.voltageData.slice();
        if (!sort.active || sort.direction === '') {
            this.voltageData = data;
            return;
        }

        this.voltageData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'created': return compare(a.created, b.created, isAsc);
                case 'voltageMax': return compare(a.voltageMax, b.voltageMax, isAsc);
                case 'voltageMin': return compare(a.voltageMin, b.voltageMin, isAsc);
                case 'voltageAvg': return compare(a.voltageAvg, b.voltageAvg, isAsc);
                case 'amperageMax': return compare(a.amperageMax, b.amperageMax, isAsc);
                case 'amperageMin': return compare(a.amperageMin, b.amperageMin, isAsc);
                case 'amperageAvg': return compare(a.amperageAvg, b.amperageAvg, isAsc);
                default: return 0;
            }
        });
    }
}

function daysInMonth(year: number, month: number) {
    const days = new Date(year, month, 0).getDate();
    return days;
}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

