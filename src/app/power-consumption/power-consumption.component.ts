import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog.component';
import { PowerService } from '../services/power-service';
import { QuestionDialogComponent } from '../dialogs/question-dialog/question-dialog.component';
import { PowerMeteringDto } from '../models/power-metering.dto';
import { NewPowerMeteringDto } from '../models/new-power-metering.dto';
import { EditPowerConsumptionComponent } from './edit-power-consumption.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';

@Component({
  selector: 'app-power-consumption',
  templateUrl: './power-consumption.component.html',
  styleUrls: ['./power-consumption.component.css'],
})


export class PowerConsumptionComponent extends AppBaseComponent implements OnInit, OnDestroy, AfterViewInit {

  displayedColumns: string[] = ['eventDate', 'factualData', 'monitorData', 'difference', 'coefficient', 'buttons'];
  sortedData = new MatTableDataSource();
  minId = -1;

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
        const powerData = await this.powerService.getPowerConsumptionData();
        const minItem = powerData.reduce((prev, curr) => {
          return prev.id < curr.id ? prev : curr;
        });
        if (minItem !== null) {
          this.minId = minItem.id;
        }
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
    const data = new PowerMeteringDto();
    data.eventDate = new Date();
    if (this.sortedData.data && this.sortedData.data.length > 0) {
      data.factualData = (this.sortedData.data[0] as PowerMeteringDto).monitorData;
    }
    const dialogResult = await EditPowerConsumptionComponent.show(this.dialog, data);
    if (dialogResult) {
      try {
        this.showSpinner('Saving...');
        const newRecord = new NewPowerMeteringDto();
        newRecord.eventDate = dialogResult.eventDate;
        newRecord.value = dialogResult.factualData;
        await this.powerService.addPowerMeteringRecord(newRecord);
        this.closeSpinner();
        await this.refreshData();
      } catch (err) {
        this.closeSpinner();
        console.log(err);
        ErrorDialogComponent.show(this.dialog, `Could not add this record because: '${err.error.message}'`);
      }
    }
  }

  async editRecord(record: PowerMeteringDto) {
    const dialogResult = await EditPowerConsumptionComponent.show(this.dialog, record);
    if (dialogResult) {
      try {
        this.showSpinner('Saving...');
        const newRecord = new NewPowerMeteringDto();
        newRecord.eventDate = dialogResult.eventDate;
        newRecord.value = dialogResult.factualData;
        await this.powerService.editPowerMeteringRecord(dialogResult.id, newRecord);
        this.closeSpinner();
        await this.refreshData();
      } catch (err) {
        this.closeSpinner();
        console.log(err);
        ErrorDialogComponent.show(this.dialog, `Could not add this record because: '${err.error.message}'`);
      }
    }
  }

  isDeleteButtonDisabled(elementId: number) {
    return elementId !== this.minId;
  }

}
