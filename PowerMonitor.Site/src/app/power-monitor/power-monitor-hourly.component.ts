import { Component, OnInit } from '@angular/core';

import { PowerService } from '../services/power-service';
import { IPowerDataHourlyModel } from '../models/power-data-hourly.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material';


//https://momentjs.com/docs/#/displaying/format/


@Component({
    selector: 'app-power-monitor-hourly',
    templateUrl: './power-monitor-hourly.component.html'
})
export class PowerMonitorHourlyComponent implements OnInit {

    public powerData: IPowerDataHourlyModel[];
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

    constructor(private powerService: PowerService, private activatedRouter: ActivatedRoute, private router: Router) {
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

    async dateChanged(type: string, event: MatDatepickerInputEvent<Date>) {
        this.currentDate = new Date(event.value);
        this.router.navigate(['power-monitor', 'hourly',
            { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1, day: this.currentDate.getDate() }]);
        await this.refreshData();
    }

    async refreshData() {
        try {
            this.powerData = await this.powerService.getPowerDataHourly(this.currentDate, this.currentDate);
            this.prepareChart(this.powerData);
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


}

