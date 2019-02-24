import { Component, OnInit, OnDestroy } from '@angular/core';

import { PowerService } from '../services/power-service';
import { IPowerDataHourlyModel } from '../models/power-data-hourly.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent, MatDialog, MatDialogRef } from '@angular/material';
import { SpinnerDialogComponent } from '../spinner-dialog/spinner-dialog.component';
import { utils } from 'protractor';
import { strict } from 'assert';
import { stringUtils } from '../utils';


// https://momentjs.com/docs/#/displaying/format/


@Component({
    selector: 'app-power-monitor-hourly',
    templateUrl: './power-monitor-hourly.component.html'
})
export class PowerMonitorHourlyComponent implements OnInit, OnDestroy {

    public powerData: IPowerDataHourlyModel[];
    public powerSum: number;
    private dialogRef: MatDialogRef<SpinnerDialogComponent>;

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

    constructor(private powerService: PowerService,
        private activatedRouter: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog) {
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

    ngOnDestroy(): void {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    async dateChanged(type: string, event: MatDatepickerInputEvent<Date>) {
        this.currentDate = new Date(event.value);
        this.router.navigate(['power-monitor', 'hourly',
            { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1, day: this.currentDate.getDate() }]);
        await this.refreshData();
    }

    async refreshData() {
        setTimeout(() => {
            this.dialogRef = this.dialog.open(SpinnerDialogComponent, {
                panelClass: 'transparent',
                disableClose: true
            });
        });
        try {
            this.powerData = await this.powerService.getPowerDataHourly(this.currentDate, this.currentDate);
            this.prepareChart(this.powerData);
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
        return stringUtils.formatNumber(value);
    }
}

