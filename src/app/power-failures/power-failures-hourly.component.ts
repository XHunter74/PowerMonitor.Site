import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PowerService } from '../services/power-service';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Moment } from 'moment';
import { IPowerFailureModel } from '../models/power-failure.model';
import { daysInMonth } from '../utils';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MONTH_DATE_FORMATS } from '../app-date-format';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog.component';
import { Constants } from '../constants';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort, MatSortHeader } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Direction } from '../models/app.enums';

const PowerFailuresSort = 'power-failures-sort-hourly';

@Component({
  selector: 'app-power-failures-hourly',
  templateUrl: './power-failures-hourly.component.html',
  styleUrls: ['./power-failures-hourly.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MONTH_DATE_FORMATS }
  ]
})


export class PowerFailuresHourlyComponent extends AppBaseComponent implements OnInit, OnDestroy {

  Direction = Direction;
  
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  currentDate: Date;
  currentDateControl: UntypedFormControl = new UntypedFormControl();
  displayedColumns: string[] = ['start', 'finish', 'duration'];
  sortedData = new MatTableDataSource();
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
        const powerData = await this.powerService.getPowerFailuresHourlyData(startDate, finishDate);
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
    this.router.navigate(['power-failures/daily'], { queryParams: { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1 } });
    this.refreshData();
  }

  formatDuration(duration: number): string {
    const sec_num = Math.floor(duration / 1000);
    const hours = Math.floor(sec_num / 3600);
    const minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    const seconds = sec_num - (hours * 3600) - (minutes * 60);

    const hoursS = hours.toString().padStart(2, '0');
    const minutesS = minutes.toString().padStart(2, '0');
    const secondsS = seconds.toString().padStart(2, '0');

    return `${hoursS}h ${minutesS}m ${secondsS}s`;
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
