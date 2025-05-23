import { Component, OnInit, OnDestroy } from '@angular/core';
import { daysInMonth } from '../../utils';
import { IPowerDataDailyModel } from '../../models/power-data-daily.model';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import { Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MONTH_DATE_FORMATS } from '../../adapters/app-date-format';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';
import { ChartConfiguration, Chart, ChartEvent, ActiveElement } from 'chart.js';
import { Constants } from '../../constants';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepicker } from '@angular/material/datepicker';
import { default as Annotation } from 'chartjs-plugin-annotation';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { MonitorDailyState } from '../../store/reducers/power-monitor.daily.reducer';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import { loadDailyMonitorData } from '../../store/actions/power-monitor.daily.actions';

@Component({
    selector: 'app-power-monitor-daily',
    templateUrl: './power-monitor-daily.component.html',
    styleUrls: ['./power-monitor.component.css'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MONTH_DATE_FORMATS },
    ],
})
export class PowerMonitorDailyComponent extends AppBaseComponent implements OnInit, OnDestroy {
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

    currentDate: Date = null;
    currentDateControl: UntypedFormControl = new UntypedFormControl();
    public powerForecast: number;
    powerMonitorDataState$: Observable<MonitorDailyState>;
    stateSubscription: Subscription;

    // events
    public chartClicked(e: any): void {
        if (e.active.length > 0) {
            const days = e.active['0'].index + 1;
            this.router.navigate(['power-monitor', 'hourly'], {
                queryParams: {
                    year: this.currentDate.getFullYear(),
                    month: this.currentDate.getMonth() + 1,
                    day: days,
                },
            });
        }
    }

    chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
        const month = normalizedMonth.month();
        const year = normalizedMonth.year();
        const date = new Date(year, month, 1);
        datepicker.close();
        this.store.dispatch(loadDailyMonitorData({ date }));
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
        translate.onLangChange.subscribe(async () => {
            this.translateWords();
        });
    }

    translateWords() {
        this.translate.get('POWER_MONITOR.CHART_LABEL').subscribe((chartLabel) => {
            const data = [{ data: this.barChartData[0].data, label: chartLabel }];
            this.barChartData = data;
        });
    }

    ngOnInit() {
        this.powerMonitorDataState$ = this.store.select('powerMonitorDaily');
        Chart.register(Annotation);
        this.activatedRouter.queryParams.subscribe((params) => {
            const year = params['year'];
            const month = params['month'];
            const date =
                year && month ? new Date(parseInt(year), parseInt(month) - 1, 1) : new Date();
            if (!this.currentDate) {
                this.currentDate = date;
                this.store.dispatch(loadDailyMonitorData({ date }));
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

    public processChangedState(state: MonitorDailyState) {
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
            this.router.navigate(['power-monitor', 'daily'], {
                queryParams: {
                    year: this.currentDate.getFullYear(),
                    month: this.currentDate.getMonth() + 1,
                },
            });
        }
        if (!state.loading && state.data) {
            this.powerData = state.data;
            this.prepareChart(this.currentDate, this.powerData);
            this.powerSum = state.powerSum;
            this.powerAvg = state.powerAvg;
            this.powerForecast = state.forecast;
            if (this.powerAvg > 0) {
                this.annotation.value = this.powerAvg;
                this.annotation.borderWidth = 1.5;
            } else {
                this.annotation.borderWidth = 0;
            }
        }
    }

    async refreshData() {
        this.store.dispatch(loadDailyMonitorData({ date: this.currentDate }));
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
            chartData = data.map((e) => {
                return e.power;
            });
            chartLabels = data.map((e) => {
                const day = new Date(e.created).getDate();
                return day.toString();
            });
        }
        this.barChartData[0].data = chartData;
        this.barChartLabels = chartLabels;
    }

    async addMonth(direction: string) {
        const date = new Date(this.currentDate);
        if (direction === 'up') {
            date.setMonth(this.currentDate.getMonth() + 1);
        } else {
            date.setMonth(this.currentDate.getMonth() - 1);
        }
        this.store.dispatch(loadDailyMonitorData({ date }));
    }

    isAddMonthButtonDisabled(direction: string): boolean {
        const nextDate = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            this.currentDate.getDate(),
        );
        if (direction === 'up') {
            nextDate.setMonth(nextDate.getMonth() + 1);
            const today = new Date();
            return (
                nextDate.getFullYear() * 12 + nextDate.getMonth() >
                today.getFullYear() * 12 + today.getMonth()
            );
        } else {
            nextDate.setMonth(nextDate.getMonth() - 1);
            return (
                nextDate.getFullYear() <= Constants.systemStartDate.getFullYear() &&
                nextDate.getMonth() < Constants.systemStartDate.getMonth()
            );
        }
    }
}
