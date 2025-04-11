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
import { PowerConsumptionState } from '../store/reducers/power-consumption.reducer';
import { Observable, Subscription } from 'rxjs';
import { AppState } from '../store/reducers';
import { Store } from '@ngrx/store';
import { loadPowerConsumptionData } from '../store/actions/power-consumption.actions';

@Component({
  selector: 'app-power-consumption',
  templateUrl: './power-consumption.component.html',
  styleUrls: ['./power-consumption.component.css'],
})


export class PowerConsumptionComponent extends AppBaseComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['eventDate', 'factualData', 'monitorData', 'difference', 'coefficient', 'buttons'];
  sortedData = new MatTableDataSource();
  minId = -1;
  powerConsumptionDataState$: Observable<PowerConsumptionState>;
  stateSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    dialog: MatDialog,
    private powerService: PowerService,
    translate: TranslateService
  ) {
    super(dialog, translate);
  }

  async ngOnInit() {
    this.powerConsumptionDataState$ = this.store.select('powerConsumption');
    this.stateSubscription = this.powerConsumptionDataState$.subscribe(state => {
      this.processChangedState(state);
    });
    this.store.dispatch(loadPowerConsumptionData({ data: {} }));
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
    if (this.powerConsumptionDataState$) {
      this.powerConsumptionDataState$ = null;
    }
  }

  private processChangedState(state: PowerConsumptionState) {
    if (state.loading) {
      this.showSpinner();
    } else {
      this.closeSpinner();
    }
    if (state.error) {
      this.translate.get('ERRORS.COMMON')
        .subscribe(errorText => {
          ErrorDialogComponent.show(this.dialog, errorText);
        });
      return;
    }
    if (!state.loading && state.data) {
      this.sortedData.data = state.data;
      if (state.minItem) {
        this.minId = state.minItem.id;
      }
    }
  }

  async refreshData() {
    this.store.dispatch(loadPowerConsumptionData({ data: {} }));
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
