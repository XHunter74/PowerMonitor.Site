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
    currentDateControl: FormControl = new FormControl();

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
        setTimeout(() => {
            this.showSpinner();
        });
        try {
            const startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
            const finishDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(),
                daysInMonth(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1));
            this.powerData = await this.powerService.getPowerDataDaily(startDate, finishDate);
            this.prepareChart(this.currentDate, this.powerData);
            this.powerSum = 0;
            for (const record of this.powerData) {
                this.powerSum = this.powerSum + record.power;
            }
            this.powerSum = Math.round(this.powerSum * 100) / 100;
            this.dialogRef.close();
        } catch (e) {
            this.dialogRef.close();
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

