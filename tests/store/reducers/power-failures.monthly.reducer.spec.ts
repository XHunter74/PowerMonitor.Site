import { powerFailuresMonthlyReducer } from '../../../src/app/store/reducers/power-failures.monthly.reducer';
import {
    loadMonthlyFailuresData,
    loadMonthlyFailuresDataFailure,
} from '../../../src/app/store/actions/power-failures.monthly.actions';

describe('powerFailuresMonthlyReducer', () => {
    it('should return the initial state', () => {
        const state = powerFailuresMonthlyReducer(undefined, { type: 'unknown' } as any);
        expect(state).toEqual({
            data: [],
            totalPowerFailure: 0,
            failureAmount: 0,
            date: null,
            loading: false,
            error: null,
        });
    });

    it('should set loading true on loadMonthlyFailuresData', () => {
        const state = powerFailuresMonthlyReducer(
            undefined,
            loadMonthlyFailuresData({ date: new Date() }),
        );
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should set error on loadMonthlyFailuresDataFailure', () => {
        const error = 'fail';
        const state = powerFailuresMonthlyReducer(
            undefined,
            loadMonthlyFailuresDataFailure({ error }),
        );
        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
    });
});
