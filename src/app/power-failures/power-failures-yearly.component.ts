import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PowerService } from '../services/power-service';
import { Router } from '@angular/router';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { PowerFailureMonthlyModel } from '../models/power-failure-monthly.model';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Direction } from '../models/app.enums';
import { AppUtils } from '../utils/app-utils';
import { TranslateService } from '@ngx-translate/core';

const PowerFailuresSort = 'power-failures-sort-yearly';

@Component({
  selector: 'app-power-failures-yearly',
  templateUrl: './power-failures-yearly.component.html',
  styleUrls: ['./power-failures-yearly.component.css']
})


export class PowerFailuresYearlyComponent extends AppBaseComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['year', 'duration', 'events'];
  sortedData = new MatTableDataSource();
  totalPowerFailure: number;
  failureAmount: number;
  formatDuration = AppUtils.formatDuration;
  formatDurationWithDays = AppUtils.formatDurationWithDays;

  Direction = Direction;

  constructor(private powerService: PowerService,
    private router: Router,
    dialog: MatDialog,
    translate: TranslateService) {
    super(dialog, translate);
  }

  async ngOnInit() {
    await this.refreshData();
    this.sortedData.sort = this.sort;
    this.restoreSort();
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
    setTimeout(async () => {
      this.showSpinner();
      try {
        this.sortedData.data = [];
        const powerData = await this.powerService.getPowerFailuresYearlyData();
        this.sortedData.data = powerData;
        this.totalPowerFailure = 0;
        this.totalPowerFailure = powerData.reduce((a, b) => a + b.duration, 0);
        this.failureAmount = powerData.reduce((a, b) => a + b.events, 0);;
        this.closeSpinner();
      } catch (e) {
        this.closeSpinner();
        const errorText = await this.translate.get('ERRORS.COMMON').toPromise();
        setTimeout(() => ErrorDialogComponent.show(this.dialog, errorText));
      }
    });
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
