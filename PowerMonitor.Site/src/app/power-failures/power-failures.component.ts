import { Component, OnInit } from '@angular/core';
import { PowerService } from '../services/power-service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material';

@Component({
  selector: 'app-power-failures',
  templateUrl: './power-failures.component.html',
})


export class PowerFailuresComponent implements OnInit {

  currentDate: Date;
  currentDateControl: FormControl = new FormControl();

  chosenMonthHandler(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const month = normlizedMonth.month();
    const year = normlizedMonth.year();
    this.currentDate = new Date(year, month, 1);
    datepicker.close();
    this.currentDateControl.setValue(this.currentDate.toISOString());
    this.router.navigate(['power-failures', { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1 }]);
    this.refreshData();
  }

  constructor(private powerService: PowerService, private router: Router, private activatedRouter: ActivatedRoute) {
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


  }
}
