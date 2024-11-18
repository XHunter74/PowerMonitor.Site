import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, ViewEncapsulation } from '@angular/core';
import { PowerService } from '../services/power-service';
import { IPowerDataHourlyModel } from '../models/power-data-hourly.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import { StringUtils } from '../utils';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { ChartConfiguration, Chart } from 'chart.js';
import { IPowerDataDailyModel } from '../models/power-data-daily.model';
import { Constants } from '../constants';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { default as Annotation } from 'chartjs-plugin-annotation';

@Component({
    selector: 'app-power-monitor-hourly',
    templateUrl: './power-monitor-hourly.component.html',
    styleUrls: ['./power-monitor.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PowerMonitorHourlyComponent extends AppBaseComponent implements OnInit, AfterViewChecked {

    public powerData: IPowerDataHourlyModel[];
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
    public lineChartPlugins = [Annotation];

    @ViewChild('powerChart') myCanvas: ElementRef;
    public context: CanvasRenderingContext2D;
    public powerForecast: number;

    constructor(private powerService: PowerService,
        private activatedRouter: ActivatedRoute,
        private router: Router,
        dialog: MatDialog) {
        super(dialog);
    }

    async ngOnInit() {
        Chart.register(Annotation);
        this.activatedRouter.queryParams.subscribe(
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
        await this.refreshData();
    }

    ngAfterViewChecked(): void {
        if (this.myCanvas) {
            this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
        }
    }

    async dateChanged(event: MatDatepickerInputEvent<Date>) {
        this.currentDate = new Date(event.value);
        this.router.navigate(['power-monitor', 'hourly'],
            { queryParams: { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1, day: this.currentDate.getDate() } });
        await this.refreshData();
    }

    async refreshData() {
        if (this.currentDateControl.value !== this.currentDate.toISOString()) {
            this.currentDateControl.setValue(this.currentDate.toISOString());
        }
        setTimeout(async () => {
            this.showSpinner();
            try {
                this.powerForecast = null;
                this.powerData = await this.powerService.getPowerDataHourly(this.currentDate, this.currentDate);
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
                this.powerForecast = await this.getPowerForecast();
                this.closeSpinner();
            } catch (e) {
                this.closeSpinner();
                console.log(e);
                setTimeout(() => ErrorDialogComponent.show(this.dialog, 'Something going wrong!'));
            }
        });
    }

    private async getPowerForecast(): Promise<number> {
        const currentDate = new Date();
        if (this.currentDate.getDate() === currentDate.getDate() &&
            this.currentDate.getMonth() === currentDate.getMonth() &&
            this.currentDate.getFullYear() === currentDate.getFullYear()) {
            const powerDataStats = await this.powerService.getPowerDataStats();
            const currentHour = currentDate.getHours();
            let result = 0;
            for (let i = 0; i < 24; i++) {
                const powerDataRecord = this.powerData.find(e => e.hours === i);
                const power = powerDataRecord ? powerDataRecord.power : 0;
                if (i < currentHour) {
                    result += power;
                } else {
                    if (power > powerDataStats[i].power) {
                        result += power;
                    } else {
                        result += powerDataStats[i].power;
                    }
                }
            }
            return result;
        } else {
            return null;
        }
    }

    getAveragePower(powerData: IPowerDataDailyModel[]): number {
        let powerAvg = 0;
        if (powerData && powerData.length > 1) {
            const today = new Date();
            if (today.getDate() === this.currentDate.getDate() &&
                today.getMonth() === this.currentDate.getMonth() &&
                today.getFullYear() === this.currentDate.getFullYear()) {
                {
                    const partOfDay = today.getHours() + today.getMinutes() / 60;
                    if (partOfDay > 0) {
                        powerAvg = this.powerSum / partOfDay;
                    }
                }
            } else {
                powerAvg = this.powerSum / 24;
            }
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
        this.router.navigate(['power-monitor', 'hourly'],
            { queryParams: { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1, day: this.currentDate.getDate() } });
        await this.refreshData();
    }

    isAddDayButtonDisabled(direction: string): boolean {
        const nextDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(),
            this.currentDate.getDate());
        if (direction === 'up') {
            nextDate.setDate(nextDate.getDate() + 1);
            return nextDate > new Date();
        } else {
            nextDate.setDate(nextDate.getDate() - 1);
            return nextDate < Constants.systemStartDate;
        }
    }

    checkChart() {
        if (this.powerData && this.context.canvas.hidden) {
            this.prepareChart(this.powerData);
        }
    }
}

