import * as actions from '../../../src/app/store/actions/power-consumption.actions';
import { NewPowerMeteringDto } from '../../../src/app/models/new-power-metering.dto';
import {
    PowerConsumptionAddState,
    PowerConsumptionDeleteState,
    PowerConsumptionEditState,
    PowerConsumptionState,
} from '../../../src/app/store/reducers/power-consumption.reducer';

describe('Power Consumption Actions', () => {
    it('should create loadPowerConsumptionData action', () => {
        const payload = { data: { foo: 'bar' } };
        const action = actions.loadPowerConsumptionData(payload);
        expect(action.type).toBe('[Power Consumption] Load Data');
        expect(action.data).toEqual(payload.data);
    });

    it('should create loadPowerConsumptionDataSuccess action', () => {
        const data = {} as PowerConsumptionState;
        const action = actions.loadPowerConsumptionDataSuccess({ data });
        expect(action.type).toBe('[Power Consumption] Load Data Success');
        expect(action.data).toBe(data);
    });

    it('should create loadPowerConsumptionDataFailure action', () => {
        const error = 'error';
        const action = actions.loadPowerConsumptionDataFailure({ error });
        expect(action.type).toBe('[Power Consumption] Load Data Failure');
        expect(action.error).toBe(error);
    });

    it('should create deletePowerConsumptionData action', () => {
        const action = actions.deletePowerConsumptionData({ recordId: 1 });
        expect(action.type).toBe('[Power Consumption] Delete Data');
        expect(action.recordId).toBe(1);
    });

    it('should create deletePowerConsumptionDataSuccess action', () => {
        const data = {} as PowerConsumptionDeleteState;
        const action = actions.deletePowerConsumptionDataSuccess({ data });
        expect(action.type).toBe('[Power Consumption] Delete Data Success');
        expect(action.data).toBe(data);
    });

    it('should create deletePowerConsumptionDataFailure action', () => {
        const error = 'error';
        const action = actions.deletePowerConsumptionDataFailure({ error });
        expect(action.type).toBe('[Power Consumption] Delete Data Failure');
        expect(action.error).toBe(error);
    });

    it('should create addPowerConsumptionData action', () => {
        const newRecord = {} as NewPowerMeteringDto;
        const action = actions.addPowerConsumptionData({ newRecord });
        expect(action.type).toBe('[Power Consumption] Add Data');
        expect(action.newRecord).toBe(newRecord);
    });

    it('should create addPowerConsumptionDataSuccess action', () => {
        const data = {} as PowerConsumptionAddState;
        const action = actions.addPowerConsumptionDataSuccess({ data });
        expect(action.type).toBe('[Power Consumption] Add Data Success');
        expect(action.data).toBe(data);
    });

    it('should create addPowerConsumptionDataFailure action', () => {
        const error = 'error';
        const action = actions.addPowerConsumptionDataFailure({ error });
        expect(action.type).toBe('[Power Consumption] Add Data Failure');
        expect(action.error).toBe(error);
    });

    it('should create editPowerConsumptionData action', () => {
        const newRecord = {} as NewPowerMeteringDto;
        const action = actions.editPowerConsumptionData({ id: 2, newRecord });
        expect(action.type).toBe('[Power Consumption] Edit Data');
        expect(action.id).toBe(2);
        expect(action.newRecord).toBe(newRecord);
    });

    it('should create editPowerConsumptionDataSuccess action', () => {
        const data = {} as PowerConsumptionEditState;
        const action = actions.editPowerConsumptionDataSuccess({ data });
        expect(action.type).toBe('[Power Consumption] Edit Data Success');
        expect(action.data).toBe(data);
    });

    it('should create editPowerConsumptionDataFailure action', () => {
        const error = 'error';
        const action = actions.editPowerConsumptionDataFailure({ error });
        expect(action.type).toBe('[Power Consumption] Edit Data Failure');
        expect(action.error).toBe(error);
    });
});
