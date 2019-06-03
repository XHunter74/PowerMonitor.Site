import { Component, OnInit } from '@angular/core';

import { PowerService } from '../services/power-service';
import { IPowerDataHourlyModel } from '../models/power-data-hourly.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent, MatDialog } from '@angular/material';
import { StringUtils } from '../utils';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog.component';
import { ChartOptions } from 'chart.js';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { IPowerDataDailyModel } from '../models/power-data-daily.model';

@Component({
    selector: 'app-power-monitor-hourly',
    templateUrl: './power-monitor-hourly.component.html'
})
export class PowerMonitorHourlyComponent extends AppBaseComponent implements OnInit {

    public powerData: IPowerDataHourlyModel[];
    public powerSum: number;
    public powerAvg: number;

    private annotation: any = {
        annotations: [
            {
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: 0,
                borderColor: 'blue',
                borderWidth: 1.5,
                borderDash: [10, 10],
                // borderDashOffset: 20,
                label: {
                    enabled: true,
                    fontColor: 'blue',
                    backgroundColor: 'white',
                    content: 'Average'
                }
            },
        ],
    };
    public barChartOptions: (ChartOptions & { annotation: any }) = {
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    min: 0,
                }
            }]
        }
    };
    public barChartLabels: string[] = [];
    public barChartType = 'bar';
    public barChartLegend = true;

    public barChartData: any[] = [
        { data: [], label: 'Power, kW/h' }
    ];

    currentDate: Date;
    currentDateControl: FormControl = new FormControl();
    public lineChartPlugins = [pluginAnnotations];

    constructor(private powerService: PowerService,
        private activatedRouter: ActivatedRoute,
        private router: Router,
        dialog: MatDialog) {
        super(dialog);
    }

    ngOnInit(): void {
        this.activatedRouter.params.subscribe(
            params => {
                const year = params['year'];
                const month = params['month'];
                const day = params['day'];
                if (year && month && day) {
                    // tslint:disable-next-line: radix
                    this.currentDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                } else {
                    this.currentDate = new Date();
                }
            }
        );
        this.currentDateControl.setValue(this.currentDate.toISOString());
        this.refreshData();
    }

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    async dateChanged(event: MatDatepickerInputEvent<Date>) {
        this.currentDate = new Date(event.value);
        this.router.navigate(['power-monitor', 'hourly',
            { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1, day: this.currentDate.getDate() }]);
        await this.refreshData();
    }

    async refreshData() {
        setTimeout(async () => {
            this.showSpinner();
            try {
                this.powerData = await this.powerService.getPowerDataHourly(this.currentDate, this.currentDate);
                this.prepareChart(this.powerData);
                this.powerSum = 0;
                this.powerSum = this.powerData.reduce((a, b) => a + b.power, 0);
                this.powerSum = Math.round(this.powerSum * 100) / 100;
                this.powerAvg = this.getAveragePower(this.powerData);
                if (this.powerAvg > 0) {
                    this.annotation.annotations[0].value = this.powerAvg;
                    this.barChartOptions.annotation = this.annotation;
                } else {
                    this.barChartOptions.annotation = null;
                }
                this.closeSpinner();
            } catch (e) {
                this.closeSpinner();
                console.log(e);
                setTimeout(() => ErrorDialogComponent.show(this.dialog, 'Something going wrong!'));
            }
        });
    }

    getAveragePower(powerData: IPowerDataDailyModel[]): number {
        let powerAvg = 0;
        if (powerData && powerData.length > 1) {
            const today = new Date();
            let reduceSum = false;
            const powerSum = powerData
                .filter(a => {
                    const creationDate = new Date(a.created);
                    const reduceSumInt = creationDate.getDate() === today.getDate() && creationDate.getFullYear() === today.getFullYear() &&
                        creationDate.getMonth() === today.getMonth() && a.hours === today.getHours();
                    if (reduceSumInt) {
                        reduceSum = true;
                    }
                    return !reduceSumInt;
                })
                .reduce((a, b) => a + b.power, 0);
            if (reduceSum) {
                powerAvg = powerSum / (powerData.length - 1);
            } else {
                powerAvg = powerSum / (powerData.length);
            }
            powerAvg = Math.round(powerAvg * 100) / 100;
        }
        return powerAvg;
    }

    prepareChart(data: IPowerDataHourlyModel[]) {
        let chartData: number[] = [];
        let chartLabels: string[] = [];
        if (data.length < 24) {
            for (let i = 0; i < 24; i++) {
                chartData.push(0);
                chartLabels.push((i).toString());
            }
            for (const record of data) {
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

    public formatNumber(value: number): string {
        return StringUtils.formatNumber(value);
    }

    async addDay(direction: string) {
        if (direction === 'up') {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
        } else {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
        }
        this.currentDateControl.setValue(this.currentDate.toISOString());
        this.router.navigate(['power-monitor', 'hourly',
            { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1, day: this.currentDate.getDate() }]);
        await this.refreshData();
    }
}

