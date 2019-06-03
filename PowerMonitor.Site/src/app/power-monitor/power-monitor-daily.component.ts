import { Component, OnInit } from '@angular/core';

import { PowerService } from '../services/power-service';
import { daysInMonth } from '../utils';
import { IPowerDataDailyModel } from '../models/power-data-daily.model';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDatepicker, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDialog } from '@angular/material';
import { Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MONTH_DATE_FORMATS } from '../app-date-format';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog.component';
import { ChartOptions } from 'chart.js';
import * as pluginAnnotations from 'chartjs-plugin-annotation';

@Component({
    selector: 'app-power-monitor-daily',
    templateUrl: './power-monitor-daily.component.html',
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MONTH_DATE_FORMATS }
    ]
})
export class PowerMonitorDailyComponent extends AppBaseComponent implements OnInit {

    public powerData: IPowerDataDailyModel[];
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
                    enabled: false,
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

    chosenMonthHandler(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
        const month = normlizedMonth.month();
        const year = normlizedMonth.year();
        this.currentDate = new Date(year, month, 1);
        datepicker.close();
        this.router.navigate(['power-monitor', 'daily',
            { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1 }]);
        this.currentDateControl.setValue(this.currentDate.toISOString());
        this.refreshData();
    }

    constructor(private powerService: PowerService,
        private router: Router,
        private activatedRouter: ActivatedRoute,
        dialog: MatDialog) {
        super(dialog);
    }

    ngOnInit(): void {
        this.activatedRouter.params.subscribe(
            params => {
                const year = params['year'];
                const month = params['month'];
                if (year && month) {
                    // tslint:disable-next-line: radix
                    this.currentDate = new Date(parseInt(year), parseInt(month) - 1, 1);
                } else {
                    this.currentDate = new Date();
                }
            }
        );
        this.currentDateControl.setValue(this.currentDate.toISOString());
        this.refreshData();
    }


    async refreshData() {
        setTimeout(async () => {
            this.showSpinner();
            try {
                const startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
                const finishDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(),
                    daysInMonth(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1));
                this.powerData = await this.powerService.getPowerDataDaily(startDate, finishDate);
                this.prepareChart(this.currentDate, this.powerData);
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
                        creationDate.getMonth() === today.getMonth();
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
                const day = new Date(e.created).getDate();
                return day.toString();
            });
        }
        this.barChartData[0].data = chartData;
        this.barChartLabels = chartLabels;
    }

    async addMonth(direction: string) {
        if (direction === 'up') {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        } else {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        }
        this.currentDateControl.setValue(this.currentDate.toISOString());
        this.router.navigate(['power-monitor', 'daily',
            { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1 }]);
        await this.refreshData();
    }

}

