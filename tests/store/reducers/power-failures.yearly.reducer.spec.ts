import { powerFailuresYearlyReducer } from '../../../src/app/store/reducers/power-failures.yearly.reducer';
import {
    loadYearlyFailuresData,
    loadYearlyFailuresDataFailure,
} from '../../../src/app/store/actions/power-failures.yearly.actions';

describe('powerFailuresYearlyReducer', () => {
    it('should return the initial state', () => {
        const state = powerFailuresYearlyReducer(undefined, { type: 'unknown' } as any);
        expect(state).toEqual({
            data: [],
            totalPowerFailure: 0,
            failureAmount: 0,
            loading: false,
            error: null,
        });
    });

    it('should set loading true on loadYearlyFailuresData', () => {
        const state = powerFailuresYearlyReducer(undefined, loadYearlyFailuresData({ data: null }));
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should set error on loadYearlyFailuresDataFailure', () => {
        const error = 'fail';
        const state = powerFailuresYearlyReducer(
            undefined,
            loadYearlyFailuresDataFailure({ error }),
        );
        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
    });
});
