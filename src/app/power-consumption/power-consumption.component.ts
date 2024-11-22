import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { PowerService } from '../services/power-service';
import { QuestionDialogComponent } from '../dialogs/question-dialog/question-dialog.component';
import { PowerMeteringDto } from '../models/power-metering.dto';
import { NewPowerMeteringDto } from '../models/new-power-metering.dto';
import { EditPowerConsumptionComponent } from './edit-power-consumption.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-power-consumption',
  templateUrl: './power-consumption.component.html',
  styleUrls: ['./power-consumption.component.css'],
})


export class PowerConsumptionComponent extends AppBaseComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['eventDate', 'factualData', 'monitorData', 'difference', 'coefficient', 'buttons'];
  sortedData = new MatTableDataSource();
  minId = -1;

  constructor(
    dialog: MatDialog,
    private powerService: PowerService,
    translate: TranslateService
  ) {
    super(dialog, translate);
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
        const errorText = await this.translate.get('ERRORS.COMMON').toPromise();
        setTimeout(() => ErrorDialogComponent.show(this.dialog, errorText));
      }
    });
  }

  async deleteRecord(recordId: number) {
    const questionText = await this.translate.get('POWER_CONSUMPTION.DELETE_QUESTION').toPromise();
    const yesText = await this.translate.get('COMMON.YES').toPromise();
    const noText = await this.translate.get('COMMON.NO').toPromise();
    const dialogResult = await QuestionDialogComponent.show(this.dialog, questionText, yesText, noText);
    if (dialogResult === 'positive') {
      try {
        await this.powerService.deletePowerMeteringRecord(recordId);
        await this.refreshData();
      } catch (err) {
        console.log(err);
        const errorText = await this.translate.get('POWER_CONSUMPTION.DELETE_ERROR').toPromise();
        setTimeout(() => ErrorDialogComponent.show(this.dialog, errorText));
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
        const errorText = await this.translate.get('POWER_CONSUMPTION.ADD_ERROR').toPromise();
        setTimeout(() => ErrorDialogComponent.show(this.dialog, errorText));
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
        const errorText = await this.translate.get('POWER_CONSUMPTION.EDIT_ERROR').toPromise();
        setTimeout(() => ErrorDialogComponent.show(this.dialog, errorText));
      }
    }
  }

  isDeleteButtonDisabled(elementId: number) {
    return elementId !== this.minId;
  }

}
