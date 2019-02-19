import { Component, OnInit } from '@angular/core';

import { PowerService } from '../services/power-service';
import { daysInMonth } from '../utils';
import { IPowerDataDailyModel } from '../models/power-data-daily.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-power-monitor-daily',
    templateUrl: './power-monitor-daily.component.html'
})
export class PowerMonitorDailyComponent implements OnInit {

    public powerData: IPowerDataDailyModel[];
    public powerSum: number;

    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[] = [];
    public barChartType = 'bar';
    public barChartLegend = true;

    public barChartData: any[] = [
        { data: [], label: 'Power, kW/h' }
    ];
    currentDate: Date;

    // events
    public chartClicked(e: any): void {
        if (e.active.length > 0) {
            const days = e.active['0']._index + 1;
            this.router.navigate(['power-monitor', 'hourly',
                { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1, day: days }]);
        }
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    constructor(private powerService: PowerService, private router: Router) {
    }

    ngOnInit(): void {
        this.currentDate = new Date();
        this.refreshData();
    }

    async refreshData() {
        try {
            const startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
            const finishDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(),
                daysInMonth(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1));
            this.powerData = await this.powerService.getPowerDataMonthly(startDate, finishDate);
            this.prepareChart(this.currentDate, this.powerData);
            this.powerSum = 0;
            for (const record of this.powerData) {
                this.powerSum = this.powerSum + record.power;
            }
            this.powerSum = Math.round(this.powerSum * 100) / 100;
        } catch (e) {
            console.log(e);
            alert('Something going wrong!');
        }
    }

    prepareChart(currentDate: Date, data: IPowerDataDailyModel[]) {
        let chartData: number[] = [];
        let chartLabels: string[] = [];
        const days = daysInMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);
        if (data.length < days) {
            for (let i = 0; i < days; i++) {
                chartData.push(0);
                chartLabels.push((i + 1).toString());
            }
            for (const record of data) {
                const day = new Date(record.created).getDate();
                chartData[day - 1] = record.power;
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

