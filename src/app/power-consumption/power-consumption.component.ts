import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { QuestionDialogComponent } from '../dialogs/question-dialog/question-dialog.component';
import { PowerMeteringDto } from '../models/power-metering.dto';
import { NewPowerMeteringDto } from '../models/new-power-metering.dto';
import { EditPowerConsumptionComponent } from './edit-power-consumption.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { PowerConsumptionAddState, PowerConsumptionDeleteState, PowerConsumptionEditState, PowerConsumptionState } from '../store/reducers/power-consumption.reducer';
import { Observable, Subscription } from 'rxjs';
import { AppState } from '../store/reducers';
import { Store } from '@ngrx/store';
import { addPowerConsumptionData, deletePowerConsumptionData, editPowerConsumptionData, loadPowerConsumptionData } from '../store/actions/power-consumption.actions';

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
  powerConsumptionDeleteState$: Observable<PowerConsumptionDeleteState>;
  deleteStateSubscription: Subscription;
  powerConsumptionAddState$: Observable<PowerConsumptionAddState>;
  addStateSubscription: Subscription;
  powerConsumptionEditState$: Observable<PowerConsumptionEditState>;
  editStateSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    dialog: MatDialog,
    translate: TranslateService
  ) {
    super(dialog, translate);
  }

  async ngOnInit() {
    this.powerConsumptionDataState$ = this.store.select('powerConsumption');
    this.powerConsumptionDeleteState$ = this.store.select('powerConsumptionDelete');
    this.powerConsumptionAddState$ = this.store.select('powerConsumptionAdd');
    this.powerConsumptionEditState$ = this.store.select('powerConsumptionEdit');

    this.stateSubscription = this.powerConsumptionDataState$.subscribe(state => {
      this.processChangedState(state);
    });

    this.deleteStateSubscription = this.powerConsumptionDeleteState$.subscribe(state => {
      if (state && ((state.loading || state.error) || (!state.loading && state.operationComplete))) {
        this.processChangedDeleteState(state);
      }
    });

    this.addStateSubscription = this.powerConsumptionAddState$.subscribe(state => {
      if (state && ((state.loading || state.error) || (!state.loading && state.operationComplete))) {
        this.processChangedAddState(state);
      }
    });

    this.editStateSubscription = this.powerConsumptionEditState$.subscribe(state => {
      if (state && ((state.loading || state.error) || (!state.loading && state.operationComplete))) {
        this.processChangedEditState(state);
      }
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
    if (this.deleteStateSubscription) {
      this.deleteStateSubscription.unsubscribe();
    }
    if (this.powerConsumptionDeleteState$) {
      this.powerConsumptionDeleteState$ = null;
    }
    if (this.addStateSubscription) {
      this.addStateSubscription.unsubscribe();
    }
    if (this.powerConsumptionAddState$) {
      this.powerConsumptionAddState$ = null;
    }
    if (this.editStateSubscription) {
      this.editStateSubscription.unsubscribe();
    }
    if (this.powerConsumptionEditState$) {
      this.powerConsumptionEditState$ = null;
    }
  }

  private processChangedDeleteState(state: PowerConsumptionDeleteState) {
    if (state.loading) {
      this.translate.get('POWER_CONSUMPTION.DELETING').subscribe(text => {
        this.showSpinner(text);
      });
    } else {
      this.closeSpinner();

      if (!state.error && state.operationComplete) {
        this.store.dispatch(loadPowerConsumptionData({ data: {} }));
      }
    }

    if (state.error) {
      this.translate.get('POWER_CONSUMPTION.DELETE_ERROR').subscribe(errorText => {
        ErrorDialogComponent.show(this.dialog, errorText);
      });
      this.closeSpinner();
    }
  }

  private processChangedAddState(state: PowerConsumptionAddState) {
    if (state.loading) {
      this.translate.get('POWER_CONSUMPTION.ADDING').subscribe(text => {
        this.showSpinner(text);
      });
    } else {
      this.closeSpinner();

      if (!state.error && state.operationComplete) {
        this.store.dispatch(loadPowerConsumptionData({ data: {} }));
      }
    }

    if (state.error) {
      this.translate.get('POWER_CONSUMPTION.ADD_ERROR').subscribe(errorText => {
        ErrorDialogComponent.show(this.dialog, errorText);
      });
      this.closeSpinner();
    }
  }

  private processChangedEditState(state: PowerConsumptionEditState) {
    if (state.loading) {
      this.translate.get('POWER_CONSUMPTION.EDITING').subscribe(text => {
        this.showSpinner(text);
      });
    } else {
      this.closeSpinner();

      if (!state.error && state.operationComplete) {
        this.store.dispatch(loadPowerConsumptionData({ data: {} }));
      }
    }

    if (state.error) {
      this.translate.get('POWER_CONSUMPTION.EDIT_ERROR').subscribe(errorText => {
        ErrorDialogComponent.show(this.dialog, errorText);
      });
      this.closeSpinner();
    }
  }

  private processChangedState(state: PowerConsumptionState) {
    if (state.loading) {
      this.translate.get('COMMON.LOADING')
        .subscribe(text => {
          this.showSpinner(text);
        });
    } else {
      this.closeSpinner();
    }
    if (state.error) {
      this.translate.get('ERRORS.COMMON')
        .subscribe(errorText => {
          ErrorDialogComponent.show(this.dialog, errorText);
        });
      this.closeSpinner();
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

  deleteRecord(recordId: number) {
    this.translate.get(['POWER_CONSUMPTION.DELETE_QUESTION', 'COMMON.YES', 'COMMON.NO'])
      .subscribe(translations => {
        const questionText = translations['POWER_CONSUMPTION.DELETE_QUESTION'];
        const yesText = translations['COMMON.YES'];
        const noText = translations['COMMON.NO'];

        QuestionDialogComponent.show(this.dialog, questionText, yesText, noText).then(dialogResult => {
          if (dialogResult === 'positive') {
            this.store.dispatch(deletePowerConsumptionData({ recordId }));
          }
        });
      });
  }

  async addNewRecord() {
    const data = new PowerMeteringDto();
    data.eventDate = new Date();
    if (this.sortedData.data && this.sortedData.data.length > 0) {
      data.factualData = (this.sortedData.data[0] as PowerMeteringDto).monitorData;
    }
    const dialogResult = await EditPowerConsumptionComponent.show(this.dialog, data);
    if (dialogResult) {
      const newRecord = new NewPowerMeteringDto();
      newRecord.eventDate = dialogResult.eventDate;
      newRecord.value = dialogResult.factualData;
      this.store.dispatch(addPowerConsumptionData({ newRecord }));
    }
  }

  async editRecord(record: PowerMeteringDto) {
    const dialogResult = await EditPowerConsumptionComponent.show(this.dialog, record);
    if (dialogResult) {
      const newRecord = new NewPowerMeteringDto();
      newRecord.eventDate = dialogResult.eventDate;
      newRecord.value = dialogResult.factualData;
      this.store.dispatch(editPowerConsumptionData({ id: dialogResult.id, newRecord }));
    }
  }

  isDeleteButtonDisabled(elementId: number) {
    return elementId !== this.minId;
  }

}
