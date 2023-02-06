import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { PowerService } from '../services/power-service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Moment } from 'moment';
import {
  MatDatepicker, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, Sort, MatDialog,
  MatTableDataSource, MatSort, MatSortHeader
} from '@angular/material';
import { IPowerFailureModel } from '../models/power-failure.model';
import { daysInMonth, compare } from '../utils';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MONTH_DATE_FORMATS } from '../app-date-format';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog.component';
import { Constants } from '../constants';

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


export class PowerFailuresDailyComponent extends AppBaseComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  currentDate: Date;
  currentDateControl: FormControl = new FormControl();
  displayedColumns: string[] = ['start', 'finish', 'duration'];
  sortedData = new MatTableDataSource();
  private lastSort: string;
  private lastSortDirection: string;
  maxPowerFailure: IPowerFailureModel;
  totalPowerFailure: number;
  failureAmount: number;
  private rowsColor: any[] = [];

  constructor(private powerService: PowerService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    dialog: MatDialog) {
    super(dialog);
  }

  ngAfterViewInit() {
    this.sortedData.sort = this.sort;
    this.restoreSort();
  }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe(
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
    this.refreshData();
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
        const startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const finishDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(),
          daysInMonth(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1));
        const powerData = await this.powerService.getPowerFailuresData(startDate, finishDate);
        this.sortedData.data = powerData;
        this.maxPowerFailure =
          powerData.find(o => o.duration === Math.max.apply(null, powerData.map(e => e.duration)));
        this.totalPowerFailure = 0;
        this.totalPowerFailure = powerData.reduce((a, b) => a + b.duration, 0);
        this.failureAmount = powerData.length;
        let previousDate;
        let previousIdx = 0;
        this.rowsColor = [];
        for (const item of powerData) {
          const itemDate = new Date(item.start);
          if (!previousDate ||
            previousDate.getTime() !== (new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate())).getTime()) {
            previousDate = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
            previousIdx++;
          }
          const newItem = {
            rowDate: previousDate,
            idx: previousIdx
          };
          this.rowsColor.push(newItem);
        }

        this.closeSpinner();
      } catch (e) {
        console.log(e.message);
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

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const month = normalizedMonth.month();
    const year = normalizedMonth.year();
    this.currentDate = new Date(year, month, 1);
    datepicker.close();
    this.currentDateControl.setValue(this.currentDate.toISOString());
    this.router.navigate(['power-failures/daily', { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1 }]);
    this.refreshData();
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

  async addMonth(direction: string) {
    if (direction === 'up') {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    } else {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    }
    this.currentDateControl.setValue(this.currentDate.toISOString());
    this.router.navigate(['power-failures/daily',
      { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1 }]);
    await this.refreshData();
  }

  isAddMonthButtonDisabled(direction: string): boolean {
    const nextDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(),
      this.currentDate.getDate());
    if (direction === 'up') {
      nextDate.setMonth(nextDate.getMonth() + 1);
      const today = new Date();
      return (nextDate.getFullYear() * 12 + nextDate.getMonth()) > (today.getFullYear() * 12 + today.getMonth());
    } else {
      nextDate.setMonth(nextDate.getMonth() - 1);
      return nextDate.getFullYear() <= Constants.systemStartDate.getFullYear() &&
        nextDate.getMonth() < Constants.systemStartDate.getMonth();
    }
  }

  getRowIndex(row) {
    if (this.rowsColor && this.rowsColor.length > 0) {
      let rowDate = new Date(row.start);
      rowDate = new Date(rowDate.getFullYear(), rowDate.getMonth(), rowDate.getDate());
      const item = this.rowsColor.find(e => e.rowDate.getTime() === rowDate.getTime());
      return item.idx;
    } else {
      return 1;
    }
  }

}
