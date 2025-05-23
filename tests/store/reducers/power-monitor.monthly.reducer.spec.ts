import { powerMonitorMonthlyReducer } from '../../../src/app/store/reducers/power-monitor.monthly.reducer';
import {
    loadMonthlyMonitorData,
    loadMonthlyMonitorDataFailure,
} from '../../../src/app/store/actions/power-monitor.monthly.actions';

describe('powerMonitorMonthlyReducer', () => {
    it('should return the initial state', () => {
        const state = powerMonitorMonthlyReducer(undefined, { type: 'unknown' } as any);
        expect(state).toEqual({
            data: [],
            powerSum: 0,
            powerAvg: 0,
            date: null,
            loading: false,
            error: null,
        });
    });

    it('should set loading true on loadMonthlyMonitorData', () => {
        const state = powerMonitorMonthlyReducer(
            undefined,
            loadMonthlyMonitorData({ date: new Date() }),
        );
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should set error on loadMonthlyMonitorDataFailure', () => {
        const error = 'fail';
        const state = powerMonitorMonthlyReducer(
            undefined,
            loadMonthlyMonitorDataFailure({ error }),
        );
        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
    });
});
