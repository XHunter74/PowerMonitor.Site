import { Component, OnInit, ViewChild } from '@angular/core';
import { AppBaseComponent } from '../base-component/app-base.component';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IVoltageAmperageModel } from '../models/voltage-amperage.model';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { Constants } from '../constants';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSort, Sort, MatSortHeader } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/reducers';
import { loadVoltageAmperage } from '../store/actions/voltage-amperage.actions';
import { VoltageAmperageState } from '../store/reducers/voltage-amperage.reducer';
import { Observable, Subscription } from 'rxjs';

const VoltageAmperageHourlySort = 'voltage-amperage-hourly-sort';

@Component({
    selector: 'app-voltage-amperage-hourly',
    templateUrl: './voltage-amperage-hourly.component.html',
    styleUrls: ['./voltage-amperage-hourly.component.css']
})
export class VoltageAmperageHourlyComponent extends AppBaseComponent implements OnInit {

    @ViewChild(MatSort, { static: true }) sort: MatSort;
    sortedData = new MatTableDataSource();
    displayedColumns: string[] = ['created', 'hours', 'voltageMax', 'voltageMin',
        'voltageAvg', 'amperageMax', 'amperageMin', 'amperageAvg'];

    public currentDate: Date = null;
    currentDateControl: UntypedFormControl = new UntypedFormControl();
    maxVoltage: IVoltageAmperageModel;
    minVoltage: IVoltageAmperageModel;
    maxAmperage: IVoltageAmperageModel;
    minAmperage: IVoltageAmperageModel;

    voltageAmperageState$: Observable<VoltageAmperageState>;
    stateSubscription: Subscription;

    constructor(
        private store: Store<AppState>,
        private activatedRouter: ActivatedRoute,
        private router: Router,
        dialog: MatDialog,
        translate: TranslateService
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
                sort.sort({ id: restoredSort.active, start: restoredSort.direction, disableClear: false });
                const sortable = sort.sortables.get(restoredSort.active);
                if (sortable) {
                    (sortable as MatSortHeader)._setAnimationTransitionState({ toState: 'active' });
                }
            }
        }
    }

    ngOnInit() {
        this.voltageAmperageState$ = this.store.select('voltageAmperage');

        this.activatedRouter.queryParams.subscribe(params => {
            const year = params['year'];
            const month = params['month'];
            const day = params['day'];
            const date = year && month && day ? new Date(parseInt(year), parseInt(month) - 1, parseInt(day)) :
                new Date();
            if (!this.currentDate) {
                this.currentDate = date;
                this.store.dispatch(loadVoltageAmperage({ date }));
            }
        });

        this.sortedData.sort = this.sort;
        this.restoreSort();
        this.stateSubscription = this.voltageAmperageState$.subscribe(state => {
            this.processChangedState(state);
        })
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.stateSubscription.unsubscribe();
    }

    processChangedState(state: VoltageAmperageState) {
        console.log('Loading', state.loading);
        if (state.loading) {
            this.showSpinner();
        } else {
            console.log('Spinner should be closed');
            this.closeSpinner();
        }
        if (state.error) {
            this.translate.get('ERRORS.COMMON')
                .subscribe(errorText => {
                    ErrorDialogComponent.show(this.dialog, errorText);
                });
            return;
        }
        if (state.date) {
            this.currentDate = state.date;
            this.currentDateControl.setValue(this.currentDate.toISOString());
            this.router.navigate(['voltage-amperage', 'hourly'], {
                queryParams: {
                    year: this.currentDate.getFullYear(),
                    month: this.currentDate.getMonth() + 1, day: this.currentDate.getDate()
                }
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

    addDay(direction: string) {
        const currentDate = new Date(this.currentDate);
        if (direction === 'up') {
            currentDate.setDate(currentDate.getDate() + 1);
        } else {
            currentDate.setDate(currentDate.getDate() - 1);
        }

        this.store.dispatch(loadVoltageAmperage({ date: currentDate }));
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

    refreshData() {
        this.store.dispatch(loadVoltageAmperage({ date: this.currentDate }));
    }
}

