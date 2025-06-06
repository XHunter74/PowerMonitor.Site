import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AppBaseComponent } from '../base-component/app-base.component';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IVoltageAmperageModel } from '../../models/voltage-amperage.model';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import { loadVoltageAmperage } from '../../store/actions/voltage-amperage.actions';
import { VoltageAmperageState } from '../../store/reducers/voltage-amperage.reducer';
import { Observable, Subscription } from 'rxjs';
import { ComponentUtils } from '../../shared/component-utils';
import { Direction } from '../../models/app.enums';

const VoltageAmperageHourlySort = 'voltage-amperage-hourly-sort';

@Component({
    selector: 'app-voltage-amperage-hourly',
    templateUrl: './voltage-amperage-hourly.component.html',
    styleUrls: ['./voltage-amperage-hourly.component.css'],
    standalone: false,
})
export class VoltageAmperageHourlyComponent extends AppBaseComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    sortedData = new MatTableDataSource();
    displayedColumns: string[] = [
        'created',
        'hours',
        'voltageMax',
        'voltageMin',
        'voltageAvg',
        'amperageMax',
        'amperageMin',
        'amperageAvg',
    ];

    public currentDate: Date = null;
    currentDateControl: UntypedFormControl = new UntypedFormControl();
    maxVoltage: IVoltageAmperageModel;
    minVoltage: IVoltageAmperageModel;
    maxAmperage: IVoltageAmperageModel;
    minAmperage: IVoltageAmperageModel;

    voltageAmperageState$: Observable<VoltageAmperageState>;
    stateSubscription: Subscription;
    public isHourlyChangeDayButtonDisabled = ComponentUtils.isHourlyChangeDayButtonDisabled;
    Direction = Direction;

    constructor(
        private store: Store<AppState>,
        private activatedRouter: ActivatedRoute,
        private router: Router,
        dialog: MatDialog,
        translate: TranslateService,
    ) {
        super(dialog, translate);
    }

    restoreSort() {
        const sort = this.sortedData.sort;
        const restoredSortStr = localStorage.getItem(VoltageAmperageHourlySort);
        if (restoredSortStr) {
            const restoredSort = <Sort>JSON.parse(restoredSortStr);
            if (restoredSort.active && restoredSort.direction) {
                sort.sort({ id: null, start: restoredSort.direction, disableClear: false });
                sort.sort({
                    id: restoredSort.active,
                    start: restoredSort.direction,
                    disableClear: false,
                });
            }
        }
    }

    ngOnInit() {
        this.voltageAmperageState$ = this.store.select('voltageAmperage');

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
                this.store.dispatch(loadVoltageAmperage({ date }));
            }
        });

        this.sortedData.sort = this.sort;
        this.restoreSort();
        this.stateSubscription = this.voltageAmperageState$.subscribe((state) => {
            this.processChangedState(state);
        });
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.stateSubscription) {
            this.stateSubscription.unsubscribe();
        }
        if (this.voltageAmperageState$) {
            this.voltageAmperageState$ = null;
        }
    }

    processChangedState(state: VoltageAmperageState) {
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
        if (state.date) {
            this.currentDate = state.date;
            this.currentDateControl.setValue(this.currentDate.toISOString());
            this.router.navigate(['voltage-amperage', 'hourly'], {
                queryParams: {
                    year: this.currentDate.getFullYear(),
                    month: this.currentDate.getMonth() + 1,
                    day: this.currentDate.getDate(),
                },
            });
        }
        if (!state.loading && state.data) {
            this.processReceivedData(state);
        }
    }

    dateChanged(event: MatDatepickerInputEvent<Date>) {
        const date = new Date(event.value);
        this.store.dispatch(loadVoltageAmperage({ date }));
    }

    processReceivedData(state: VoltageAmperageState) {
        this.sortedData.data = state.data;
        this.maxVoltage = state.maxVoltage;
        this.minVoltage = state.minVoltage;
        this.maxAmperage = state.maxAmperage;
        this.minAmperage = state.minAmperage;
    }

    sortData(sort: Sort): void {
        if (sort) {
            localStorage.setItem(VoltageAmperageHourlySort, JSON.stringify(sort));
        }
    }

    addDay(direction: Direction) {
        const currentDate = new Date(this.currentDate);
        if (direction === Direction.Up) {
            currentDate.setDate(currentDate.getDate() + 1);
        } else {
            currentDate.setDate(currentDate.getDate() - 1);
        }

        this.store.dispatch(loadVoltageAmperage({ date: currentDate }));
    }

    refreshData() {
        this.store.dispatch(loadVoltageAmperage({ date: this.currentDate }));
    }
}
