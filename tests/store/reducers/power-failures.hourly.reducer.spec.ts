import { powerFailuresHourlyReducer } from '../../../src/app/store/reducers/power-failures.hourly.reducer';
import {
    loadHourlyFailuresData,
    loadHourlyFailuresDataFailure,
} from '../../../src/app/store/actions/power-failures.hourly.actions';

describe('powerFailuresHourlyReducer', () => {
    it('should return the initial state', () => {
        const state = powerFailuresHourlyReducer(undefined, { type: 'unknown' } as any);
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

    it('should set loading true on loadHourlyFailuresData', () => {
        const state = powerFailuresHourlyReducer(
            undefined,
            loadHourlyFailuresData({ date: new Date() }),
        );
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should set error on loadHourlyFailuresDataFailure', () => {
        const error = 'fail';
        const state = powerFailuresHourlyReducer(
            undefined,
            loadHourlyFailuresDataFailure({ error }),
        );
        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
    });
});
