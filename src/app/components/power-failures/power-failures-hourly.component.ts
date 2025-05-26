import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IPowerFailureModel } from '../../models/power-failure.model';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';
import { Constants } from '../../shared/constants';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort, MatSortHeader } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Direction } from '../../models/app.enums';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { FailuresHourlyState } from '../../store/reducers/power-failures.hourly.reducer';
import { AppState } from '../../store/reducers';
import { Store } from '@ngrx/store';
import { loadHourlyFailuresData } from '../../store/actions/power-failures.hourly.actions';

const PowerFailuresSort = 'power-failures-sort-hourly';

@Component({
    selector: 'app-power-failures-hourly',
    templateUrl: './power-failures-hourly.component.html',
    styleUrls: ['./power-failures.components.css'],
})
export class PowerFailuresHourlyComponent extends AppBaseComponent implements OnInit, OnDestroy {
    Direction = Direction;

    @ViewChild(MatSort, { static: true }) sort: MatSort;
    currentDate: Date = null;
    currentDateControl: UntypedFormControl = new UntypedFormControl();
    displayedColumns: string[] = ['start', 'finish', 'duration'];
    sortedData = new MatTableDataSource();
    maxPowerFailure: IPowerFailureModel;
    totalPowerFailure: number;
    failureAmount: number;
    failuresDataState$: Observable<FailuresHourlyState>;
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
        this.failuresDataState$ = this.store.select('powerFailuresHourly');
        this.activatedRouter.queryParams.subscribe((params) => {
            const year = params['year'];
            const month = params['month'];
            const day = params['day'];
            const date =
                year && month && day
                    ? new Date(parseInt(year), parseInt(month) - 1, day)
                    : new Date();
            if (!this.currentDate) {
                this.currentDate = date;
                this.store.dispatch(loadHourlyFailuresData({ date }));
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

    public processChangedState(state: FailuresHourlyState) {
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
            this.router.navigate(['power-failures', 'hourly'], {
                queryParams: {
                    year: this.currentDate.getFullYear(),
                    month: this.currentDate.getMonth() + 1,
                    day: this.currentDate.getDate(),
                },
            });
        }
        if (!state.loading && state.data) {
            this.sortedData.data = state.data;
            this.totalPowerFailure = state.totalPowerFailure;
            this.failureAmount = state.failureAmount;
            this.maxPowerFailure = state.maxPowerFailure;
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
        this.store.dispatch(loadHourlyFailuresData({ date: this.currentDate }));
    }

    sortData(sort: Sort) {
        if (sort) {
            localStorage.setItem(PowerFailuresSort, JSON.stringify(sort));
        }
    }

    addDay(direction: string) {
        const date = new Date(this.currentDate);
        if (direction === Direction.Up) {
            date.setDate(date.getDate() + 1);
        } else {
            date.setDate(date.getDate() - 1);
        }
        this.store.dispatch(loadHourlyFailuresData({ date }));
    }

    isAddDayButtonDisabled(direction: string): boolean {
        const nextDate = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            this.currentDate.getDate(),
        );
        if (direction === 'up') {
            nextDate.setDate(nextDate.getDate() + 1);
            return nextDate > new Date();
        } else {
            nextDate.setDate(nextDate.getDate() - 1);
            return nextDate < Constants.systemStartDate;
        }
    }

    dateChanged(event: MatDatepickerInputEvent<Date>) {
        const date = new Date(event.value);
        this.store.dispatch(loadHourlyFailuresData({ date }));
    }
}
