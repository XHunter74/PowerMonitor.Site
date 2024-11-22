import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PowerService } from '../services/power-service';
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
import { AppUtils } from '../utils/app-utils';
import { TranslateService } from '@ngx-translate/core';

const PowerFailuresSort = 'power-failures-sort-daily';

@Component({
  selector: 'app-power-failures-daily',
  templateUrl: './power-failures-daily.component.html',
  styleUrls: ['./power-failures-daily.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MONTH_DATE_FORMATS }
  ]
})


export class PowerFailuresDailyComponent extends AppBaseComponent implements OnInit, OnDestroy {

  Direction = Direction;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  currentDate: Date;
  currentDateControl: UntypedFormControl = new UntypedFormControl();
  displayedColumns: string[] = ['eventDate', 'duration', 'events'];
  sortedData = new MatTableDataSource();
  maxPowerFailure: IPowerFailureModel;
  totalPowerFailure: number;
  failureAmount: number;
  formatDuration = AppUtils.formatDuration;

  constructor(private powerService: PowerService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    dialog: MatDialog,
    translate: TranslateService) {
    super(dialog, translate);
  }

  async ngOnInit() {
    this.activatedRouter.queryParams.subscribe(
      params => {
        const year = params['year'];
        const month = params['month'];
        if (year && month) {
          // tslint:disable-next-line: radix
          this.currentDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        } else {
          this.currentDate = new Date();
        }
      }
    );
    this.currentDateControl.setValue(this.currentDate.toISOString());
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
        const powerData = await this.powerService.getPowerFailuresDailyData(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
        this.sortedData.data = powerData;
        const maxPowerFailure = powerData
          .find(o => o.duration === Math.max.apply(null, powerData.map(e => e.duration)));
        if (maxPowerFailure) {
          this.maxPowerFailure = {
            start: maxPowerFailure.eventDate,
            finish: maxPowerFailure.eventDate,
            duration: maxPowerFailure.duration
          };
        } else {
          this.maxPowerFailure = null;
        }
        this.totalPowerFailure = 0;
        this.totalPowerFailure = powerData.reduce((a, b) => a + b.duration, 0);
        this.failureAmount = powerData.reduce((a, b) => a + b.events, 0);;
        this.closeSpinner();
      } catch (e) {
        console.log(e.message);
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

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const month = normalizedMonth.month();
    const year = normalizedMonth.year();
    this.currentDate = new Date(year, month, 1);
    datepicker.close();
    this.currentDateControl.setValue(this.currentDate.toISOString());
    this.router.navigate(['power-failures/daily'], { queryParams: { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1 } });
    this.refreshData();
  }

  async addMonth(direction: Direction) {
    if (direction === Direction.Up) {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    } else {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    }
    this.currentDateControl.setValue(this.currentDate.toISOString());
    this.router.navigate(['power-failures/daily'],
      { queryParams: { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1 } });
    await this.refreshData();
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
