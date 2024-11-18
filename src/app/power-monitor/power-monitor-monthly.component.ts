import { Component, OnInit, OnDestroy } from '@angular/core';

import { PowerService } from '../services/power-service';
import { Router, ActivatedRoute } from '@angular/router';
import { IPowerDataMonthlyModel } from '../models/power-data-monthly.model';
import { Moment } from 'moment';
import { UntypedFormControl } from '@angular/forms';
import { YEAR_DATE_FORMATS } from '../app-date-format';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { ChartConfiguration, Chart } from 'chart.js';
import { Constants } from '../constants';
import { daysInMonth } from '../utils';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepicker } from '@angular/material/datepicker';
import { default as Annotation } from 'chartjs-plugin-annotation';

@Component({
    selector: 'app-power-monitor-monthly',
    templateUrl: './power-monitor-monthly.component.html',
    styleUrls: ['./power-monitor.component.css'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: YEAR_DATE_FORMATS }
    ]
})
export class PowerMonitorMonthlyComponent extends AppBaseComponent implements OnInit, OnDestroy {

    public powerData: IPowerDataMonthlyModel[];
    public powerSum: number;
    public powerAvg: number;

    private annotation: any = {
        type: 'line',
        mode: 'horizontal',
        scaleID: 'y',
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
    };
    public barChartOptions: ChartConfiguration<'bar'>['options'] = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            annotation: {
                annotations: [
                    this.annotation
                ]
            }
        }
    };

    public barChartLabels: string[] = [];
    public barChartType = 'bar';
    public barChartLegend = true;

    public barChartData: any[] = [
        { data: [], label: 'Power, kW/h' }
    ];
    currentDate: Date;
    currentDateControl: UntypedFormControl = new UntypedFormControl();

    // events
    public chartClicked(e: any): void {
        if (e.active.length > 0) {
            const month = e.active['0'].index + 1;
            this.router.navigate(['power-monitor', 'daily'],
                { queryParams: { year: this.currentDate.getFullYear(), month: month } });
        }
    }

    chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
        const year = normalizedYear.year();
        this.currentDate = new Date(year, 0, 1);
        datepicker.close();
        this.router.navigate(['power-monitor', 'monthly'],
            { queryParams: { year: this.currentDate.getFullYear() } });
        this.currentDateControl.setValue(this.currentDate.toISOString());
        this.refreshData();
    }

    constructor(private powerService: PowerService,
        private router: Router,
        private activatedRouter: ActivatedRoute,
        dialog: MatDialog) {
        super(dialog);
    }

    async ngOnInit() {
        Chart.register(Annotation);
        this.activatedRouter.queryParams.subscribe(
            params => {
                const year = params['year'];
                if (year) {
                    // tslint:disable-next-line: radix
                    this.currentDate = new Date(parseInt(year), 0, 1);
                } else {
                    this.currentDate = new Date();
                }
            }
        );
        this.currentDateControl.setValue(this.currentDate.toISOString());
        await this.refreshData();
    }

    async refreshData() {
        if (this.currentDateControl.value !== this.currentDate.toISOString()) {
            this.currentDateControl.setValue(this.currentDate.toISOString());
        }
        setTimeout(async () => {
            this.showSpinner();
            try {
                const startDate = new Date(this.currentDate.getFullYear(), 0, 1);
                const finishDate = new Date(this.currentDate.getFullYear(), 11, 31);
                this.powerData = await this.powerService.getPowerDataMonthly(startDate, finishDate);
                this.prepareChart(this.powerData);
                this.powerSum = 0;
                this.powerSum = this.powerData.reduce((a, b) => a + b.power, 0);
                this.powerSum = Math.round(this.powerSum * 100) / 100;
                this.powerAvg = this.getAveragePower(this.powerData);
                if (this.powerAvg > 0) {
                    this.annotation.value = this.powerAvg;
                    this.annotation.borderWidth = 1.5;
                } else {
                    this.annotation.borderWidth = 0;
                }
                this.closeSpinner();
            } catch (e) {
                this.closeSpinner();
                console.log(e);
                setTimeout(() => ErrorDialogComponent.show(this.dialog, 'Something going wrong!'));
            }
        });
    }

    getAveragePower(powerData: IPowerDataMonthlyModel[]): number {
        let powerAvg = 0;
        if (powerData && powerData.length > 1) {
            const today = new Date();
            let reduceSum = 0;
            let powerSum = powerData
                .filter(a => {
                    const reduceSumInt = a.year === today.getFullYear() && a.month === today.getMonth() + 1 ||
                        a.year <= Constants.systemStartDate.getFullYear() &&
                        a.month <= Constants.systemStartDate.getMonth() + 1;
                    if (reduceSumInt) {
                        reduceSum++;
                    }
                    return !reduceSumInt;
                })
                .reduce((a, b) => a + b.power, 0);
            const powerSumCurrentMonth = powerData
                .filter(a => {
                    const reduceSumInt = a.year === today.getFullYear() && a.month === today.getMonth() + 1;
                    return reduceSumInt;
                })
                .reduce((a, b) => a + b.power, 0);

            if (reduceSum > 0) {
                let months = powerData.length - reduceSum;
                if (powerSumCurrentMonth && powerSumCurrentMonth > 0) {
                    months = months + today.getDate() / daysInMonth(today.getFullYear(), today.getMonth());
                    powerSum = powerSum + powerSumCurrentMonth;
                }
                powerAvg = powerSum / months;
            } else {
                powerAvg = powerSum / (powerData.length);
            }
            powerAvg = Math.round(powerAvg * 100) / 100;
        }
        return powerAvg;
    }

    prepareChart(data: IPowerDataMonthlyModel[]) {
        let chartData: number[] = [];
        let chartLabels: string[] = [];
        if (data.length < 12) {
            for (let i = 0; i < 12; i++) {
                chartData.push(0);
                chartLabels.push(Constants.shortMonthNames[i]);
            }
            for (const record of data) {
                chartData[record.month - 1] = record.power;
            }
        } else {
            chartData = data.map(e => {
                return e.power;
            });
            chartLabels = data.map(e => {
                return Constants.shortMonthNames[e.month - 1];
            });
        }
        this.barChartData[0].data = chartData;
        this.barChartLabels = chartLabels;
    }

    async addYear(direction: string) {
        if (direction === 'up') {
            this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
        } else {
            this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
        }
        this.currentDateControl.setValue(this.currentDate.toISOString());
        this.router.navigate(['power-monitor', 'monthly'],
            { queryParams: { year: this.currentDate.getFullYear() } });
        await this.refreshData();
    }

    isAddYearButtonDisabled(direction: string): boolean {
        const nextDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(),
            this.currentDate.getDate());
        if (direction === 'up') {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            return nextDate.getFullYear() > new Date().getFullYear();
        } else {
            nextDate.setFullYear(nextDate.getFullYear() - 1);
            return nextDate.getFullYear() < Constants.systemStartDate.getFullYear();
        }
    }

}



