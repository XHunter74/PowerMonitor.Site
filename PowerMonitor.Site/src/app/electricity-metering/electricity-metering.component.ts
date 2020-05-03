import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDialog, MatTableDataSource } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MONTH_DATE_FORMATS } from '../app-date-format';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog.component';
import { PowerService } from '../services/power-service';

@Component({
  selector: 'app-electricity-metering',
  templateUrl: './electricity-metering.component.html',
  styleUrls: ['./electricity-metering.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MONTH_DATE_FORMATS }
  ]
})


export class ElectricityMeteringComponent extends AppBaseComponent implements OnInit, OnDestroy, AfterViewInit {

  displayedColumns: string[] = ['eventDate', 'factualData', 'monitorData', 'difference', 'buttons'];
  sortedData = new MatTableDataSource();

  constructor(
    dialog: MatDialog,
    private powerService: PowerService,
  ) {
    super(dialog);
  }

  ngAfterViewInit() {
  }

  async ngOnInit() {
    await this.refreshData();
  }

  async refreshData() {
    setTimeout(async () => {
      this.showSpinner();
      try {
        const powerData = await this.powerService.getPowerMeteringData();
        this.sortedData.data = powerData;
        this.closeSpinner();
      } catch (e) {
        this.closeSpinner();
        setTimeout(() => ErrorDialogComponent.show(this.dialog, 'Something going wrong!'));
      }
    });
  }

  async deleteRecord(recordId: number) {

  }

}
