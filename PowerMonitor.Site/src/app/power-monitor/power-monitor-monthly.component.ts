import { Component, OnInit, OnDestroy } from '@angular/core';

import { PowerService } from '../services/power-service';
import { Router, ActivatedRoute } from '@angular/router';
import { IPowerDataMonthlyModel } from '../models/power-data-monthly.model';
import { Moment } from 'moment';
import { MatDatepicker, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import { YEAR_DATE_FORMATS } from '../app-date-format';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog.component';

@Component({
    selector: 'app-power-monitor-monthly',
    templateUrl: './power-monitor-monthly.component.html',
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: YEAR_DATE_FORMATS }
    ]
})
export class PowerMonitorMonthlyComponent extends AppBaseComponent implements OnInit, OnDestroy {

    public powerData: IPowerDataMonthlyModel[];
    public powerSum: number;
    public powerAvg: number;
    public barChartOptions: any = {
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

    // events
    public chartClicked(e: any): void {
        if (e.active.length > 0) {
            const month = e.active['0']._index + 1;
            this.router.navigate(['power-monitor', 'daily',
                { year: this.currentDate.getFullYear(), month: month }]);
        }
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
        const year = normalizedYear.year();
        this.currentDate = new Date(year, 0, 1);
        datepicker.close();
        this.router.navigate(['power-monitor', 'monthly',
            { year: this.currentDate.getFullYear() }]);
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
                if (year) {
                    // tslint:disable-next-line: radix
                    this.currentDate = new Date(parseInt(year), 0, 1);
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
                const startDate = new Date(this.currentDate.getFullYear(), 0, 1);
                const finishDate = new Date(this.currentDate.getFullYear(), 11, 31);
                this.powerData = await this.powerService.getPowerDataMonthly(startDate, finishDate);
                this.prepareChart(this.powerData);
                this.powerSum = 0;
                this.powerSum = this.powerData.reduce((a, b) => a + b.power, 0);
                this.powerSum = Math.round(this.powerSum * 100) / 100;
                this.powerAvg = this.getAveragePower(this.powerData);
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
            const powerSum = powerData
                .filter(a => {
                    const reduceSumInt = a.year === today.getFullYear() && a.month === today.getMonth() + 1 ||
                        a.year <= 2019 && a.month <= 2;
                    if (reduceSumInt) {
                        reduceSum++;
                    }
                    return !reduceSumInt;
                })
                .reduce((a, b) => a + b.power, 0);
            if (reduceSum > 0) {
                powerAvg = powerSum / (powerData.length - reduceSum);
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
                chartLabels.push((i + 1).toString());
            }
            for (const record of data) {
                chartData[record.month - 1] = record.power;
            }
        } else {
            chartData = data.map(e => {
                return e.power;
            });
            chartLabels = data.map(e => {
                return e.month.toString();
            });
        }
        this.barChartData[0].data = chartData;
        this.barChartLabels = chartLabels;
    }

}



