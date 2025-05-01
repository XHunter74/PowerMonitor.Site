import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppBaseComponent } from '../../base-component/app-base.component';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';
import { PowerFailureMonthlyModel } from '../../models/power-failure-monthly.model';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Direction } from '../../models/app.enums';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { FailuresYearlyState } from '../../store/reducers/power-failures.yearly.reducer';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import { loadYearlyFailuresData } from '../../store/actions/power-failures.yearly.actions';

const PowerFailuresSort = 'power-failures-sort-yearly';

@Component({
  selector: 'app-power-failures-yearly',
  templateUrl: './power-failures-yearly.component.html',
  styleUrls: ['./power-failures.components.css']
})


export class PowerFailuresYearlyComponent extends AppBaseComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['year', 'duration', 'events'];
  sortedData = new MatTableDataSource();
  totalPowerFailure: number;
  failureAmount: number;

  Direction = Direction;
  failuresDataState$: Observable<FailuresYearlyState>;
  stateSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    dialog: MatDialog,
    translate: TranslateService) {
    super(dialog, translate);
  }

  async ngOnInit() {
    this.failuresDataState$ = this.store.select('powerFailuresYearly');
    this.sortedData.sort = this.sort;
    this.restoreSort();
    this.stateSubscription = this.failuresDataState$.subscribe(state => {
      this.processChangedState(state);
    });
    this.store.dispatch(loadYearlyFailuresData({ data: null }));
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

  private processChangedState(state: FailuresYearlyState) {
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
        sort.sort({ id: restoredSort.active, start: restoredSort.direction, disableClear: false });
        if (sort.sortables.get(restoredSort.active) != undefined) {
          (sort.sortables.get(restoredSort.active) as MatSortHeader)
            ._setAnimationTransitionState({ toState: 'active' });
        }
      }
    }
  }

  async refreshData() {
    this.store.dispatch(loadYearlyFailuresData({ data: null }));
  }

  sortData(sort: Sort) {
    if (sort) {
      localStorage.setItem(PowerFailuresSort, JSON.stringify(sort));
    }
  }

  clickOnRowHandler(row: PowerFailureMonthlyModel) {
    if (row) {
      this.router.navigate(['power-failures', 'monthly'],
        { queryParams: { year: row.year } });
    }
  }
}
