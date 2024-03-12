import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { PowerService } from '../services/power-service';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Moment } from 'moment';
import { IPowerFailureModel } from '../models/power-failure.model';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { YEAR_DATE_FORMATS } from '../app-date-format';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog.component';
import { Constants } from '../constants';
import { PowerFailureMonthlyModel } from '../models/power-failure-monthly.model';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepicker } from '@angular/material/datepicker';

const PowerFailuresSort = 'power-failures-sort-monthly';

@Component({
  selector: 'app-power-failures-monthly',
  templateUrl: './power-failures-monthly.component.html',
  styleUrls: ['./power-failures-monthly.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: YEAR_DATE_FORMATS }
  ]
})


export class PowerFailuresMonthlyComponent extends AppBaseComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  currentDate: Date;
  currentDateControl: UntypedFormControl = new UntypedFormControl();
  displayedColumns: string[] = ['month', 'duration', 'events'];
  sortedData = new MatTableDataSource();
  private lastSort: string;
  private lastSortDirection: string;
  maxPowerFailure: IPowerFailureModel;
  totalPowerFailure: number;

  constructor(private powerService: PowerService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    dialog: MatDialog) {
    super(dialog);
  }

  async ngOnInit() {
    this.activatedRouter.queryParams.subscribe(
      params => {
        const year = params['year'];
        if (year) {
          // tslint:disable-next-line: radix
          this.currentDate = new Date(parseInt(year), 0, 1);
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
        (sort.sortables.get(restoredSort.active) as MatSortHeader)
          ._setAnimationTransitionState({ toState: 'active' });
      }
    }
  }

  async refreshData() {
    setTimeout(async () => {
      this.showSpinner();
      try {
        const powerData = await this.powerService.getPowerFailuresMonthlyData(this.currentDate.getFullYear());
        this.sortedData.data = powerData;
        this.closeSpinner();
      } catch (e) {
        this.closeSpinner();
        setTimeout(() => ErrorDialogComponent.show(this.dialog, 'Something going wrong!'));
      }
    });
  }

  sortData(sort: Sort) {
    if (sort) {
      localStorage.setItem(PowerFailuresSort, JSON.stringify(sort));
    }
  }



  formatDuration(duration: number): string {
    const sec_num = Math.floor(duration / 1000); // don't forget the second param
    const hours = Math.floor(sec_num / 3600);
    const minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    const seconds = sec_num - (hours * 3600) - (minutes * 60);
    let hoursS = hours.toString();
    let minutesS = minutes.toString();
    let secondsS = seconds.toString();

    if (hours < 10) { hoursS = '0' + hoursS; }
    if (minutes < 10) { minutesS = '0' + minutesS; }
    if (seconds < 10) { secondsS = '0' + secondsS; }
    return hoursS + 'h ' + minutesS + 'm ' + secondsS + 's';
  }

  async addYear(direction: string) {
    if (direction === 'up') {
      this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
    } else {
      this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
    }
    this.currentDateControl.setValue(this.currentDate.toISOString());
    this.router.navigate(['power-failures', 'monthly'],
      { queryParams: { year: this.currentDate.getFullYear() } });
    await this.refreshData();
  }

  isAddYearButtonDisabled(direction: string): boolean {
    const nextDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(),
      this.currentDate.getDate());
    if (direction === 'up') {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      return nextDate.getFullYear() > new Date().getFullYear();
    } else {
      nextDate.setFullYear(nextDate.getFullYear() - 1);
      return nextDate.getFullYear() < Constants.systemStartDate.getFullYear();
    }
  }

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const year = normalizedYear.year();
    this.currentDate = new Date(year, 0, 1);
    datepicker.close();
    this.router.navigate(['power-failures', 'monthly'],
      { queryParams: { year: this.currentDate.getFullYear() } });
    this.currentDateControl.setValue(this.currentDate.toISOString());
    this.refreshData();
  }

  clickOnRowHandler(row: PowerFailureMonthlyModel) {
    if (row) {
      this.router.navigate(['power-failures', 'daily'],
        { queryParams: { year: row.year, month: row.month } });
    }
  }
}
