import { voltageAmperageReducer } from '../../../src/app/store/reducers/voltage-amperage.reducer';
import {
    loadVoltageAmperage,
    loadVoltageAmperageSuccess,
    loadVoltageAmperageFailure,
} from '../../../src/app/store/actions/voltage-amperage.actions';

describe('voltageAmperageReducer', () => {
    it('should return the initial state', () => {
        const state = voltageAmperageReducer(undefined, { type: 'unknown' } as any);
        expect(state).toEqual({
            data: [],
            maxVoltage: null,
            minVoltage: null,
            maxAmperage: null,
            minAmperage: null,
            date: null,
            loading: false,
            error: null,
        });
    });

    it('should set loading true on loadVoltageAmperage', () => {
        const state = voltageAmperageReducer(undefined, loadVoltageAmperage({ date: new Date() }));
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should set error on loadVoltageAmperageFailure', () => {
        const error = 'fail';
        const state = voltageAmperageReducer(undefined, loadVoltageAmperageFailure({ error }));
        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
    });
});
