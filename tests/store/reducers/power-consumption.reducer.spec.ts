import {
    loadPowerConsumptionData,
    loadPowerConsumptionDataFailure,
    deletePowerConsumptionData,
    deletePowerConsumptionDataFailure,
    addPowerConsumptionData,
    addPowerConsumptionDataFailure,
    editPowerConsumptionData,
    editPowerConsumptionDataFailure,
} from '../../../src/app/store/actions/power-consumption.actions';
import {
    powerConsumptionReducer,
    powerConsumptionDeleteReducer,
    powerConsumptionAddReducer,
    powerConsumptionEditReducer,
} from '../../../src/app/store/reducers/power-consumption.reducer';

describe('powerConsumptionReducer', () => {
    it('should return the initial state', () => {
        const state = powerConsumptionReducer(undefined, { type: 'unknown' } as any);
        expect(state).toEqual({
            data: [],
            minItem: null,
            loading: false,
            error: null,
        });
    });

    it('should set loading true on loadPowerConsumptionData', () => {
        const state = powerConsumptionReducer(undefined, loadPowerConsumptionData({ data: {} }));
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should set error on loadPowerConsumptionDataFailure', () => {
        const error = 'fail';
        const state = powerConsumptionReducer(
            undefined,
            loadPowerConsumptionDataFailure({ error }),
        );
        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
    });
});

describe('powerConsumptionDeleteReducer', () => {
    it('should return the initial state', () => {
        const state = powerConsumptionDeleteReducer(undefined, { type: 'unknown' } as any);
        expect(state).toEqual({
            loading: false,
            error: null,
            operationComplete: false,
        });
    });

    it('should set loading true on deletePowerConsumptionData', () => {
        const state = powerConsumptionDeleteReducer(
            undefined,
            deletePowerConsumptionData({ recordId: 1 }),
        );
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
        expect(state.operationComplete).toBe(false);
    });

    it('should set error on deletePowerConsumptionDataFailure', () => {
        const error = 'fail';
        const state = powerConsumptionDeleteReducer(
            undefined,
            deletePowerConsumptionDataFailure({ error }),
        );
        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
        expect(state.operationComplete).toBe(false);
    });
});

describe('powerConsumptionAddReducer', () => {
    it('should return the initial state', () => {
        const state = powerConsumptionAddReducer(undefined, { type: 'unknown' } as any);
        expect(state).toEqual({
            loading: false,
            error: null,
            operationComplete: false,
        });
    });

    it('should set loading true on addPowerConsumptionData', () => {
        const state = powerConsumptionAddReducer(
            undefined,
            addPowerConsumptionData({ newRecord: {} as any }),
        );
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
        expect(state.operationComplete).toBe(false);
    });

    it('should set error on addPowerConsumptionDataFailure', () => {
        const error = 'fail';
        const state = powerConsumptionAddReducer(
            undefined,
            addPowerConsumptionDataFailure({ error }),
        );
        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
        expect(state.operationComplete).toBe(false);
    });
});

describe('powerConsumptionEditReducer', () => {
    it('should return the initial state', () => {
        const state = powerConsumptionEditReducer(undefined, { type: 'unknown' } as any);
        expect(state).toEqual({
            loading: false,
            error: null,
            operationComplete: false,
        });
    });

    it('should set loading true on editPowerConsumptionData', () => {
        const state = powerConsumptionEditReducer(
            undefined,
            editPowerConsumptionData({ id: 1, newRecord: {} as any }),
        );
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
        expect(state.operationComplete).toBe(false);
    });

    it('should set error on editPowerConsumptionDataFailure', () => {
        const error = 'fail';
        const state = powerConsumptionEditReducer(
            undefined,
            editPowerConsumptionDataFailure({ error }),
        );
        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
        expect(state.operationComplete).toBe(false);
    });
});
