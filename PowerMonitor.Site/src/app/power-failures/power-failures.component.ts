import { Component, OnInit, OnDestroy } from '@angular/core';
import { PowerService } from '../services/power-service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Moment } from 'moment';
import { MatDatepicker, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, Sort, MatDialog } from '@angular/material';
import { IPowerFailureModel } from '../models/power-failure.model';
import { daysInMonth, compare } from '../utils';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MONTH_DATE_FORMATS } from '../app-date-format';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog.component';

@Component({
  selector: 'app-power-failures',
  templateUrl: './power-failures.component.html',
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MONTH_DATE_FORMATS }
  ]
})


export class PowerFailuresComponent extends AppBaseComponent implements OnInit, OnDestroy {

  currentDate: Date;
  currentDateControl: FormControl = new FormControl();
  public powerFailuresData: IPowerFailureModel[];
  private lastSort: string;
  private lastSortDirection: string;

  chosenMonthHandler(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const month = normlizedMonth.month();
    const year = normlizedMonth.year();
    this.currentDate = new Date(year, month, 1);
    datepicker.close();
    this.currentDateControl.setValue(this.currentDate.toISOString());
    this.router.navigate(['power-failures', { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1 }]);
    this.refreshData();
  }

  constructor(private powerService: PowerService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    dialog: MatDialog) {
    super(dialog);
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

  async refreshData() {
    setTimeout(async () => {
      this.showSpinner();
      try {
        const startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const finishDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(),
          daysInMonth(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1));
        this.powerFailuresData = await this.powerService.getPowerFailuresData(startDate, finishDate);
        if (this.lastSort && this.lastSortDirection) {
          this.sortDataInt(this.lastSort, this.lastSortDirection);
        }
      } catch (e) {
        setTimeout(() => ErrorDialogComponent.show(this.dialog, 'Something going wrong!'));
      } finally {
        this.closeSpinner();
      }
    });
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }
    this.lastSort = sort.active;
    this.lastSortDirection = sort.direction;
    this.sortDataInt(sort.active, sort.direction);
  }

  private sortDataInt(activeSort: string, direction: string) {
    this.powerFailuresData = this.powerFailuresData.sort((a, b) => {
      const isAsc = direction === 'asc';
      switch (activeSort) {
        case 'start': return compare(a.start, b.start, isAsc);
        case 'finish': return compare(a.finish, b.finish, isAsc);
        case 'duration': return compare(a.duration, b.duration, isAsc);
        default: return 0;
      }
    });
  }

  formatDuration(duration: number) {
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

}
