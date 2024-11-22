import { Component, OnInit } from '@angular/core';
import { PowerService } from '../services/power-service';
import { daysInMonth } from '../utils';
import { IPowerDataDailyModel } from '../models/power-data-daily.model';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import { Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MONTH_DATE_FORMATS } from '../app-date-format';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { ChartConfiguration, Chart } from 'chart.js';
import { Constants } from '../constants';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepicker } from '@angular/material/datepicker';
import { default as Annotation } from 'chartjs-plugin-annotation';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-power-monitor-daily',
    templateUrl: './power-monitor-daily.component.html',
    styleUrls: ['./power-monitor.component.css'],
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
    public powerForecast: number;

    // events
    public chartClicked(e: any): void {
        if (e.active.length > 0) {
            const days = e.active['0'].index + 1;
            this.router.navigate(['power-monitor', 'hourly'],
                { queryParams: { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1, day: days } });
        }
    }

    chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
        const month = normalizedMonth.month();
        const year = normalizedMonth.year();
        this.currentDate = new Date(year, month, 1);
        datepicker.close();
        this.router.navigate(['power-monitor', 'daily'],
            { queryParams: { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1 } });
        this.currentDateControl.setValue(this.currentDate.toISOString());
        this.refreshData();
    }

    constructor(private powerService: PowerService,
        private router: Router,
        private activatedRouter: ActivatedRoute,
        dialog: MatDialog,
        translate: TranslateService) {
        super(dialog, translate);
        this.translateWords();
        translate.onLangChange.subscribe(async () => {
            await this.translateWords();
        });
    }

    async translateWords() {
        const chartLabel = await this.translate.get('POWER_MONITOR.CHART_LABEL').toPromise();
        const data = [
            { data: this.barChartData[0].data, label: chartLabel }
        ];
        this.barChartData = data;
    }

    async ngOnInit() {
        Chart.register(Annotation);
        this.activatedRouter.queryParams.subscribe(
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
        await this.refreshData();
    }


    async refreshData() {
        if (this.currentDateControl.value !== this.currentDate.toISOString()) {
            this.currentDateControl.setValue(this.currentDate.toISOString());
        }
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
                this.powerForecast = this.getPowerForecast();
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
                const errorText = await this.translate.get('ERRORS.COMMON').toPromise();
                setTimeout(() => ErrorDialogComponent.show(this.dialog, errorText));
            }
        });
    }

    getPowerForecast(): number {
        const currentDate = new Date();
        if (this.currentDate.getMonth() === currentDate.getMonth() &&
            this.currentDate.getFullYear() === currentDate.getFullYear()) {
            const days = daysInMonth(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
            const forecastPower = this.powerAvg * days;
            return forecastPower;
        } else {
            return null;
        }
    }

    getAveragePower(powerData: IPowerDataDailyModel[]): number {
        let powerAvg = 0;
        if (powerData && powerData.length > 0) {
            let days = powerData.length;
            if (this.isCurrentMonth(this.currentDate)) {
                days = days - 1;
                const today = new Date();
                const partOfDay = (today.getHours() + today.getMinutes() / 60) / 24;
                days = days + partOfDay;
            }
            if (days > 0) {
                powerAvg = this.powerSum / days;
                powerAvg = Math.round(powerAvg * 100) / 100;
            }
        }
        return powerAvg;
    }
    isCurrentMonth(currentDate: Date) {
        const today = new Date();
        const isCurrentMonthResult = currentDate.getFullYear() === today.getFullYear() &&
            currentDate.getMonth() === today.getMonth();
        return isCurrentMonthResult;
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
        this.router.navigate(['power-monitor', 'daily'],
            { queryParams: { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1 } });
        await this.refreshData();
    }

    isAddMonthButtonDisabled(direction: string): boolean {
        const nextDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(),
            this.currentDate.getDate());
        if (direction === 'up') {
            nextDate.setMonth(nextDate.getMonth() + 1);
            const today = new Date();
            return (nextDate.getFullYear() * 12 + nextDate.getMonth()) > (today.getFullYear() * 12 + today.getMonth());
        } else {
            nextDate.setMonth(nextDate.getMonth() - 1);
            return nextDate.getFullYear() <= Constants.systemStartDate.getFullYear() &&
                nextDate.getMonth() < Constants.systemStartDate.getMonth();
        }
    }

}

