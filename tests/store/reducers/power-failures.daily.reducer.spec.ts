import { powerFailuresDailyReducer } from '../../../src/app/store/reducers/power-failures.daily.reducer';
import {
    loadDailyFailuresData,
    loadDailyFailuresDataFailure,
} from '../../../src/app/store/actions/power-failures.daily.actions';

describe('powerFailuresDailyReducer', () => {
    it('should return the initial state', () => {
        const state = powerFailuresDailyReducer(undefined, { type: 'unknown' } as any);
        expect(state).toEqual({
            data: [],
            maxPowerFailure: null,
            totalPowerFailure: 0,
            failureAmount: 0,
            date: null,
            loading: false,
            error: null,
        });
    });

    it('should set loading true on loadDailyFailuresData', () => {
        const state = powerFailuresDailyReducer(
            undefined,
            loadDailyFailuresData({ date: new Date() }),
        );
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should set error on loadDailyFailuresDataFailure', () => {
        const error = 'fail';
        const state = powerFailuresDailyReducer(undefined, loadDailyFailuresDataFailure({ error }));
        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
    });
});
