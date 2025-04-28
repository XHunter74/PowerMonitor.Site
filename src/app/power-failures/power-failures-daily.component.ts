import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Moment } from 'moment';
import { IPowerFailureModel } from '../models/power-failure.model';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MONTH_DATE_FORMATS } from '../app-date-format';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { Constants } from '../constants';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort, MatSortHeader } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Direction } from '../models/app.enums';
import { PowerFailureDailyModel } from '../models/power-failure-daily.model';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { FailuresDailyState } from '../store/reducers/power-failures.daily.reducer';
import { Store } from '@ngrx/store';
import { AppState } from '../store/reducers';
import { loadDailyFailuresData } from '../store/actions/power-failures.daily.actions';

const PowerFailuresSort = 'power-failures-sort-daily';

@Component({
  selector: 'app-power-failures-daily',
  templateUrl: './power-failures-daily.component.html',
  styleUrls: ['./power-failures.components.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MONTH_DATE_FORMATS }
  ]
})


export class PowerFailuresDailyComponent extends AppBaseComponent implements OnInit, OnDestroy {

  Direction = Direction;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  currentDate: Date = null;
  currentDateControl: UntypedFormControl = new UntypedFormControl();
  displayedColumns: string[] = ['eventDate', 'duration', 'events'];
  sortedData = new MatTableDataSource();
  maxPowerFailure: IPowerFailureModel;
  totalPowerFailure: number;
  failureAmount: number;
  failuresDataState$: Observable<FailuresDailyState>;
  stateSubscription: Subscription;

  constructor(private store: Store<AppState>,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    dialog: MatDialog,
    translate: TranslateService) {
    super(dialog, translate);
  }

  async ngOnInit() {
    this.failuresDataState$ = this.store.select('powerFailuresDaily');
    this.activatedRouter.queryParams.subscribe(
      params => {
        const year = params['year'];
        const month = params['month'];
        const date = year && month ? new Date(parseInt(year), parseInt(month) - 1, 1) : new Date();
        if (!this.currentDate) {
          this.currentDate = date;
          this.store.dispatch(loadDailyFailuresData({ date }));
        }
      }
    );
    this.sortedData.sort = this.sort;
    this.restoreSort();
    this.stateSubscription = this.failuresDataState$.subscribe(state => {
      this.processChangedState(state);
    })
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

  private processChangedState(state: FailuresDailyState) {
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
    if (!state.loading && state.date) {
      this.currentDate = state.date;
      this.currentDateControl.setValue(this.currentDate.toISOString());
      this.router.navigate(['power-failures/daily'],
        { queryParams: { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1 } });
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
        sort.sort({ id: restoredSort.active, start: restoredSort.direction, disableClear: false });
        if (sort.sortables.get(restoredSort.active) != undefined) {
          (sort.sortables.get(restoredSort.active) as MatSortHeader)
            ._setAnimationTransitionState({ toState: 'active' });
        }
      }
    }
  }

  async refreshData() {
    this.store.dispatch(loadDailyFailuresData({ date: this.currentDate }));
  }

  sortData(sort: Sort) {
    if (sort) {
      localStorage.setItem(PowerFailuresSort, JSON.stringify(sort));
    }
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const month = normalizedMonth.month();
    const year = normalizedMonth.year();
    const date = new Date(year, month, 1);
    datepicker.close();
    this.store.dispatch(loadDailyFailuresData({ date }));
  }

  async addMonth(direction: Direction) {
    const date = new Date(this.currentDate);
    if (direction === Direction.Up) {
      date.setMonth(date.getMonth() + 1);
    } else {
      date.setMonth(date.getMonth() - 1);
    }
    this.store.dispatch(loadDailyFailuresData({ date }));
  }

  isAddMonthButtonDisabled(direction: Direction): boolean {
    const nextDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(),
      this.currentDate.getDate());
    if (direction === Direction.Up) {
      nextDate.setMonth(nextDate.getMonth() + 1);
      const today = new Date();
      return (nextDate.getFullYear() * 12 + nextDate.getMonth()) > (today.getFullYear() * 12 + today.getMonth());
    } else {
      nextDate.setMonth(nextDate.getMonth() - 1);
      return nextDate.getFullYear() <= Constants.systemStartDate.getFullYear() &&
        nextDate.getMonth() < Constants.systemStartDate.getMonth();
    }
  }

  clickOnRowHandler(row: PowerFailureDailyModel) {
    if (row) {
      this.router.navigate(['power-failures', 'hourly'],
        { queryParams: { year: row.eventDate.getFullYear(), month: row.eventDate.getMonth() + 1, day: row.eventDate.getDate() } });
    }
  }
}
