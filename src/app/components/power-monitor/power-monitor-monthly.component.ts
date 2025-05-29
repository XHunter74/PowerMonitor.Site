import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IPowerDataMonthlyModel } from '../../models/power-data-monthly.model';
import { Moment } from 'moment';
import { UntypedFormControl } from '@angular/forms';
import { YEAR_DATE_FORMATS } from '../../adapters/app-date-format';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';
import { ChartConfiguration, Chart, ChartEvent, ActiveElement } from 'chart.js';
import { Constants } from '../../shared/constants';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepicker } from '@angular/material/datepicker';
import { default as Annotation } from 'chartjs-plugin-annotation';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { MonitorMonthlyState } from '../../store/reducers/power-monitor.monthly.reducer';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import { loadMonthlyMonitorData } from '../../store/actions/power-monitor.monthly.actions';
import { ComponentUtils } from '../../shared/component-utils';
import { Direction } from '../../models/app.enums';

@Component({
    selector: 'app-power-monitor-monthly',
    templateUrl: './power-monitor-monthly.component.html',
    styleUrls: ['./power-monitor.component.css'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: YEAR_DATE_FORMATS },
    ],
    standalone: false
})
export class PowerMonitorMonthlyComponent extends AppBaseComponent implements OnInit, OnDestroy {
    public powerData: IPowerDataMonthlyModel[];
    public powerSum: number;
    public powerAvg: number;
    public isMonthlyChangeDayButtonDisabled = ComponentUtils.isMonthlyChangeDayButtonDisabled;
    Direction = Direction;

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
            content: 'Average',
        },
    };

    public barChartOptions: ChartConfiguration<'bar'>['options'] = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            annotation: {
                annotations: [this.annotation],
            },
        },
        onHover: (event: ChartEvent, elements: ActiveElement[]) => {
            const target = (event.native as MouseEvent).target as HTMLElement;
            if (elements.length > 0) {
                target.style.cursor = 'pointer';
            } else {
                target.style.cursor = 'default';
            }
        },
    };

    public barChartLabels: string[] = [];

    public barChartData: any[] = [{ data: [], label: 'Power, kW/h' }];
    currentDate: Date;
    currentDateControl: UntypedFormControl = new UntypedFormControl();
    powerMonitorDataState$: Observable<MonitorMonthlyState>;
    stateSubscription: Subscription;

    // events
    public chartClicked(e: any): void {
        if (e.active.length > 0) {
            const month = e.active['0'].index + 1;
            this.router.navigate(['power-monitor', 'daily'], {
                queryParams: { year: this.currentDate.getFullYear(), month: month },
            });
        }
    }

    chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
        const year = normalizedYear.year();
        const date = new Date(year, 0, 1);
        datepicker.close();
        this.store.dispatch(loadMonthlyMonitorData({ date }));
    }

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private activatedRouter: ActivatedRoute,
        dialog: MatDialog,
        translate: TranslateService,
    ) {
        super(dialog, translate);
        this.translateWords();
        translate.onLangChange.subscribe(() => {
            this.translateWords();
        });
    }

    translateWords() {
        this.translate.get('POWER_MONITOR.CHART_LABEL').subscribe((chartLabel) => {
            const data = [{ data: this.barChartData[0].data, label: chartLabel }];
            this.barChartData = data;
        });
        this.translate.get('MONTHS').subscribe((months: { [key: string]: string }) => {
            this.barChartLabels = Constants.shortMonthNames.map(
                (e) => months[e.toUpperCase()] || e,
            );
        });
    }

    async ngOnInit() {
        this.powerMonitorDataState$ = this.store.select('powerMonitorMonthly');
        Chart.register(Annotation);
        this.activatedRouter.queryParams.subscribe((params) => {
            const year = params['year'];
            const date = year ? new Date(parseInt(year), 0, 1) : new Date();
            if (!this.currentDate) {
                this.currentDate = date;
                this.store.dispatch(loadMonthlyMonitorData({ date }));
            }
        });
        this.stateSubscription = this.powerMonitorDataState$.subscribe((state) => {
            this.processChangedState(state);
        });
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

    public processChangedState(state: MonitorMonthlyState) {
        if (state.loading) {
            this.translate.get('COMMON.LOADING').subscribe((text) => {
                this.showSpinner(text);
            });
        } else {
            this.closeSpinner();
        }
        if (state.error) {
            this.translate.get('ERRORS.COMMON').subscribe((errorText) => {
                ErrorDialogComponent.show(this.dialog, errorText);
            });
            this.closeSpinner();
            return;
        }
        if (!state.loading && state.date) {
            this.currentDate = state.date;
            this.currentDateControl.setValue(this.currentDate.toISOString());
            this.router.navigate(['power-monitor', 'monthly'], {
                queryParams: { year: this.currentDate.getFullYear() },
            });
        }
        if (!state.loading && state.data) {
            this.powerData = state.data;
            this.prepareChart(this.powerData);
            this.powerSum = state.powerSum;
            this.powerAvg = state.powerAvg;
            if (this.powerAvg > 0) {
                this.annotation.value = this.powerAvg;
                this.annotation.borderWidth = 1.5;
            } else {
                this.annotation.borderWidth = 0;
            }
        }
    }

    async refreshData() {
        this.store.dispatch(loadMonthlyMonitorData({ date: this.currentDate }));
    }

    prepareChart(data: IPowerDataMonthlyModel[]) {
        let chartData: number[] = [];
        let chartLabels: string[] = [];
        data = this.normalizeMonthlyData(data);
        chartData = data.map((e) => {
            return e.power;
        });
        chartLabels = data.map((e) => {
            return Constants.shortMonthNames[e.month - 1];
        });
        this.translate.get('MONTHS').subscribe((months: { [key: string]: string }) => {
            chartLabels = chartLabels.map((e) => months[e.toUpperCase()] || e);
        });
        this.barChartData[0].data = chartData;
        this.barChartLabels = chartLabels;
    }

    normalizeMonthlyData(data: IPowerDataMonthlyModel[]): IPowerDataMonthlyModel[] {
        const normalizedData: IPowerDataMonthlyModel[] = [];
        for (let i = 0; i < 12; i++) {
            const record = data.find((e) => e.month === i + 1);
            if (record) {
                normalizedData.push(record);
            } else {
                normalizedData.push({
                    month: i + 1,
                    power: 0,
                    year: 0,
                });
            }
        }
        return normalizedData;
    }

    addYear(direction: Direction) {
        const date = new Date(this.currentDate);
        if (direction === Direction.Up) {
            date.setFullYear(this.currentDate.getFullYear() + 1);
        } else {
            date.setFullYear(this.currentDate.getFullYear() - 1);
        }
        this.store.dispatch(loadMonthlyMonitorData({ date }));
    }
}
