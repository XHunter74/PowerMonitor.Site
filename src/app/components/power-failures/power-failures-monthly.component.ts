import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Moment } from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { YEAR_DATE_FORMATS } from '../../adapters/app-date-format';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';
import { Constants } from '../../constants';
import { PowerFailureMonthlyModel } from '../../models/power-failure-monthly.model';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepicker } from '@angular/material/datepicker';
import { Direction } from '../../models/app.enums';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { FailuresMonthlyState } from '../../store/reducers/power-failures.monthly.reducer';
import { AppState } from '../../store/reducers';
import { Store } from '@ngrx/store';
import { loadMonthlyFailuresData } from '../../store/actions/power-failures.monthly.actions';

const PowerFailuresSort = 'power-failures-sort-monthly';

@Component({
    selector: 'app-power-failures-monthly',
    templateUrl: './power-failures-monthly.component.html',
    styleUrls: ['./power-failures.components.css'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: YEAR_DATE_FORMATS },
    ],
})
export class PowerFailuresMonthlyComponent extends AppBaseComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    currentDate: Date = null;
    currentDateControl: UntypedFormControl = new UntypedFormControl();
    displayedColumns: string[] = ['month', 'duration', 'events'];
    sortedData = new MatTableDataSource();
    totalPowerFailure: number;
    failureAmount: number;

    Direction = Direction;
    failuresDataState$: Observable<FailuresMonthlyState>;
    stateSubscription: Subscription;

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private activatedRouter: ActivatedRoute,
        dialog: MatDialog,
        translate: TranslateService,
    ) {
        super(dialog, translate);
    }

    async ngOnInit() {
        this.failuresDataState$ = this.store.select('powerFailuresMonthly');
        this.activatedRouter.queryParams.subscribe((params) => {
            const year = params['year'];
            const date = year ? new Date(parseInt(year), 0, 1) : new Date();
            if (!this.currentDate) {
                this.currentDate = date;
                this.store.dispatch(loadMonthlyFailuresData({ date }));
            }
        });

        this.sortedData.sort = this.sort;
        this.restoreSort();
        this.stateSubscription = this.failuresDataState$.subscribe((state) => {
            this.processChangedState(state);
        });
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.stateSubscription) {
            this.stateSubscription.unsubscribe();
        }
        if (this.failuresDataState$) {
            this.failuresDataState$ = null;
        }
    }

    private processChangedState(state: FailuresMonthlyState) {
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
            this.router.navigate(['power-failures', 'monthly'], {
                queryParams: { year: this.currentDate.getFullYear() },
            });
        }
        if (!state.loading && state.data) {
            this.sortedData.data = state.data;
            this.totalPowerFailure = state.totalPowerFailure;
            this.failureAmount = state.failureAmount;
        }
    }

    restoreSort() {
        const sort = this.sortedData.sort;
        const restoredSortStr = localStorage.getItem(PowerFailuresSort);
        if (restoredSortStr) {
            const restoredSort = <Sort>JSON.parse(restoredSortStr);
            if (restoredSort.active && restoredSort.direction) {
                sort.sort({ id: null, start: restoredSort.direction, disableClear: false });
                sort.sort({
                    id: restoredSort.active,
                    start: restoredSort.direction,
                    disableClear: false,
                });
                if (sort.sortables.get(restoredSort.active) != undefined) {
                    (
                        sort.sortables.get(restoredSort.active) as MatSortHeader
                    )._setAnimationTransitionState({ toState: 'active' });
                }
            }
        }
    }

    async refreshData() {
        this.store.dispatch(loadMonthlyFailuresData({ date: this.currentDate }));
    }

    sortData(sort: Sort) {
        if (sort) {
            localStorage.setItem(PowerFailuresSort, JSON.stringify(sort));
        }
    }

    async addYear(direction: string) {
        const date = new Date(this.currentDate);
        if (direction === Direction.Up) {
            date.setFullYear(date.getFullYear() + 1);
        } else {
            date.setFullYear(date.getFullYear() - 1);
        }
        this.store.dispatch(loadMonthlyFailuresData({ date }));
    }

    isAddYearButtonDisabled(direction: string): boolean {
        const nextDate = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            this.currentDate.getDate(),
        );
        if (direction === Direction.Up) {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            return nextDate.getFullYear() > new Date().getFullYear();
        } else {
            nextDate.setFullYear(nextDate.getFullYear() - 1);
            return nextDate.getFullYear() < Constants.systemStartDate.getFullYear();
        }
    }

    chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
        const year = normalizedYear.year();
        const date = new Date(year, 0, 1);
        datepicker.close();
        this.store.dispatch(loadMonthlyFailuresData({ date }));
    }

    clickOnRowHandler(row: PowerFailureMonthlyModel) {
        if (row) {
            this.router.navigate(['power-failures', 'daily'], {
                queryParams: { year: row.year, month: row.month },
            });
        }
    }
}
