import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    AfterViewChecked,
    ViewEncapsulation,
    OnDestroy,
} from '@angular/core';
import { IPowerDataHourlyModel } from '../../models/power-data-hourly.model';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormControl } from '@angular/forms';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';
import { ChartConfiguration, Chart } from 'chart.js';
import { Constants } from '../../shared/constants';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { default as Annotation } from 'chartjs-plugin-annotation';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { MonitorHourlyState } from '../../store/reducers/power-monitor.hourly.reducer';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import { loadHourlyMonitorData } from '../../store/actions/power-monitor.hourly.actions';
import { ComponentUtils } from '../../shared/component-utils';
import { Direction } from '../../models/app.enums';

@Component({
    selector: 'app-power-monitor-hourly',
    templateUrl: './power-monitor-hourly.component.html',
    styleUrls: ['./power-monitor.component.css'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class PowerMonitorHourlyComponent
    extends AppBaseComponent
    implements OnInit, AfterViewChecked, OnDestroy
{
    public powerData: IPowerDataHourlyModel[];
    public powerSum: number;
    public powerAvg: number;
    public isHourlyChangeDayButtonDisabled = ComponentUtils.isHourlyChangeDayButtonDisabled;
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
    };

    public barChartLabels: string[] = [];

    public barChartData: any[] = [{ data: [], label: 'Power, kW/h' }];

    currentDate: Date = null;
    currentDateControl: UntypedFormControl = new UntypedFormControl();
    public lineChartPlugins = [Annotation];

    @ViewChild('powerChart') myCanvas: ElementRef;
    public context: CanvasRenderingContext2D;
    public powerForecast: number;
    powerMonitorDataState$: Observable<MonitorHourlyState>;
    stateSubscription: Subscription;

    constructor(
        private store: Store<AppState>,
        private activatedRouter: ActivatedRoute,
        private router: Router,
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
        this.translate.get('POWER_MONITOR.CHART_LABEL').subscribe((text) => {
            const data = [{ data: this.barChartData[0].data, label: text }];
            this.barChartData = data;
        });
    }

    ngOnInit() {
        this.powerMonitorDataState$ = this.store.select('powerMonitorHourly');
        Chart.register(Annotation);
        this.activatedRouter.queryParams.subscribe((params) => {
            const year = params['year'];
            const month = params['month'];
            const day = params['day'];
            const date =
                year && month && day
                    ? new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
                    : new Date();
            if (!this.currentDate) {
                this.currentDate = date;
                this.store.dispatch(loadHourlyMonitorData({ date }));
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

    public processChangedState(state: MonitorHourlyState) {
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
            this.router.navigate(['power-monitor', 'hourly'], {
                queryParams: {
                    year: this.currentDate.getFullYear(),
                    month: this.currentDate.getMonth() + 1,
                    day: this.currentDate.getDate(),
                },
            });
        }

        if (!state.loading && state.data) {
            this.powerData = state.data;
            this.prepareChart(this.powerData);
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

    ngAfterViewChecked(): void {
        if (this.myCanvas) {
            this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
        }
    }

    dateChanged(event: MatDatepickerInputEvent<Date>) {
        const date = new Date(event.value);
        this.store.dispatch(loadHourlyMonitorData({ date }));
    }

    refreshData() {
        this.store.dispatch(loadHourlyMonitorData({ date: this.currentDate }));
    }

    prepareChart(data: IPowerDataHourlyModel[]) {
        data = this.normalizeHourlyData(data);
        let chartData: number[] = [];
        let chartLabels: string[] = [];
        chartData = data.map((e) => {
            return e.power;
        });
        chartLabels = data.map((e) => {
            return e.hours.toString();
        });
        this.barChartData[0].data = chartData;
        this.barChartLabels = chartLabels;
    }

    normalizeHourlyData(data: IPowerDataHourlyModel[]): IPowerDataHourlyModel[] {
        const normalizedData: IPowerDataHourlyModel[] = [];
        for (let i = 0; i < Constants.HoursInDay; i++) {
            const record = data.find((e) => e.hours === i);
            if (record) {
                normalizedData.push(record);
            } else {
                normalizedData.push({
                    hours: i,
                    power: 0,
                    created: undefined,
                });
            }
        }
        return normalizedData;
    }

    addDay(direction: Direction) {
        const date = new Date(this.currentDate);
        if (direction === Direction.Up) {
            date.setDate(this.currentDate.getDate() + 1);
        } else {
            date.setDate(this.currentDate.getDate() - 1);
        }
        this.store.dispatch(loadHourlyMonitorData({ date }));
    }
}
