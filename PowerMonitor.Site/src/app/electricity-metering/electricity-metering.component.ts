import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog.component';
import { PowerService } from '../services/power-service';
import { QuestionDialogComponent } from '../dialogs/question-dialog/question-dialog.component';
import { EditElectricityMeteringComponent } from './edit-electricity-metering.component';
import { PowerMeteringDto } from '../models/power-metering.dto';
import { NewPowerMeteringDto } from '../models/new-power-metering.dto';

@Component({
  selector: 'app-electricity-metering',
  templateUrl: './electricity-metering.component.html',
  styleUrls: ['./electricity-metering.component.css'],
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
    const dialogResult = await QuestionDialogComponent.show(this.dialog, 'Would you like to delete this record?');
    if (dialogResult === 'positive') {
      try {
        await this.powerService.deletePowerMeteringRecord(recordId);
        await this.refreshData();
      } catch (err) {
        console.log(err);
        ErrorDialogComponent.show(this.dialog, `Could not delete this record because: '${err.error.message}'`);
      }
    }
  }

  async addNewRecord() {
    const dialogRef = EditElectricityMeteringComponent.show(this.dialog);
    const dialogResult = (await dialogRef.afterClosed().toPromise()) as PowerMeteringDto;
    if (dialogResult) {
      try {
        const newRecord = new NewPowerMeteringDto();
        newRecord.eventDate = dialogResult.eventDate;
        newRecord.value = dialogResult.factualData;
        await this.powerService.addPowerMeteringRecord(newRecord);
        await this.refreshData();
      } catch (err) {
        console.log(err);
        ErrorDialogComponent.show(this.dialog, `Could not add this record because: '${err.error.message}'`);
      }
    }
  }

  async editRecord(record: PowerMeteringDto) {
    const dialogRef = EditElectricityMeteringComponent.show(this.dialog, record);
    const dialogResult = (await dialogRef.afterClosed().toPromise()) as PowerMeteringDto;
    if (dialogResult) {
      try {
        const newRecord = new NewPowerMeteringDto();
        newRecord.eventDate = dialogResult.eventDate;
        newRecord.value = dialogResult.factualData;
        await this.powerService.editPowerMeteringRecord(dialogResult.id, newRecord);
        await this.refreshData();
      } catch (err) {
        console.log(err);
        ErrorDialogComponent.show(this.dialog, `Could not add this record because: '${err.error.message}'`);
      }
    }
  }

}
