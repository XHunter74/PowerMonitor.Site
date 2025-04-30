import { Component, OnInit, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';
import { IPowerDataYearlyModel } from '../models/power-data-yearly.model';
import { YEAR_DATE_FORMATS } from '../app-date-format';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { ChartConfiguration, Chart, ChartEvent, ActiveElement } from 'chart.js';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { default as Annotation } from 'chartjs-plugin-annotation';
import { TranslateService } from '@ngx-translate/core';
import { MonitorYearlyState } from '../store/reducers/power-monitor.yearly.reducer';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../store/reducers';
import { loadYearlyMonitorData } from '../store/actions/power-monitor.yearly.actions';

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
        onHover: (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
            const target = (event.native as MouseEvent).target as HTMLElement;
            if (elements.length > 0) {
                target.style.cursor = 'pointer';
            } else {
                target.style.cursor = 'default';
            }
        }
    };

    public barChartLabels: string[] = [];

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

    powerMonitorDataState$: Observable<MonitorYearlyState>;
    stateSubscription: Subscription;


    constructor(
        private store: Store<AppState>,
        private router: Router,
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

    ngOnInit() {
        this.powerMonitorDataState$ = this.store.select('powerMonitorYearly');
        Chart.register(Annotation);
        this.stateSubscription = this.powerMonitorDataState$.subscribe(state => {
            this.processChangedState(state);
        })
        this.store.dispatch(loadYearlyMonitorData({ data: null }));
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.stateSubscription) {
            this.stateSubscription.unsubscribe();
        }
        if (this.powerMonitorDataState$) {
            this.powerMonitorDataState$ = null;
        }
    }

    private processChangedState(state: MonitorYearlyState) {
        if (state.loading) {
            this.translate.get('COMMON.LOADING')
                .subscribe(text => {
                    this.showSpinner(text);
                });
        } else {
            this.closeSpinner();
        }
        if (state.error) {
            this.translate.get('ERRORS.COMMON')
                .subscribe(errorText => {
                    ErrorDialogComponent.show(this.dialog, errorText);
                });
            this.closeSpinner();
            return;
        }
        if (!state.loading && state.data) {
            this.powerData = state.data;
            this.prepareChart(this.powerData);
        }
    }

    refreshData() {
        this.store.dispatch(loadYearlyMonitorData({ data: null }));
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
