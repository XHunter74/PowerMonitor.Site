import { Component, OnInit, OnDestroy } from '@angular/core';

import { PowerService } from '../services/power-service';
import { Router } from '@angular/router';
import { IPowerDataYearlyModel } from '../models/power-data-yearly.model';
import { YEAR_DATE_FORMATS } from '../app-date-format';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { ChartConfiguration, Chart } from 'chart.js';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { default as Annotation } from 'chartjs-plugin-annotation';

@Component({
    selector: 'app-power-monitor-yearly',
    templateUrl: './power-monitor-yearly.component.html',
    styleUrls: ['./power-monitor.component.css'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: YEAR_DATE_FORMATS }
    ]
})
export class PowerMonitorYearlyComponent extends AppBaseComponent implements OnInit, OnDestroy {

    public powerData: IPowerDataYearlyModel[];

    public barChartOptions: ChartConfiguration<'bar'>['options'] = {
        responsive: true,
        maintainAspectRatio: true,
    };

    public barChartLabels: string[] = [];
    public barChartType = 'bar';
    public barChartLegend = true;

    public barChartData: any[] = [
        { data: [], label: 'Power, kW/h' }
    ];

    // events
    public chartClicked(e: any): void {
        if (e.active.length > 0) {
            const yearIdx = e.active['0'].index;
            const year = this.barChartLabels[yearIdx];
            this.router.navigate(['power-monitor', 'monthly'], { queryParams: { year: year } });
        }
    }

    constructor(private powerService: PowerService,
        private router: Router,
        dialog: MatDialog) {
        super(dialog);
    }

    async ngOnInit() {
        Chart.register(Annotation);
        await this.refreshData();
    }

    async refreshData() {
        setTimeout(async () => {
            this.showSpinner();
            try {
                this.powerData = await this.powerService.getPowerDataYearly();
                this.prepareChart(this.powerData);
                this.closeSpinner();
            } catch (e) {
                this.closeSpinner();
                console.log(e);
                setTimeout(() => ErrorDialogComponent.show(this.dialog, 'Something going wrong!'));
            }
        });
    }

    prepareChart(data: IPowerDataYearlyModel[]) {
        const chartData = data.map(e => {
            return e.power;
        });
        const chartLabels = data.map(e => {
            return e.year.toString();
        });
        this.barChartData[0].data = chartData;
        this.barChartLabels = chartLabels;
    }
}
