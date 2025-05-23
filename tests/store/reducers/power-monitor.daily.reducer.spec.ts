import { powerMonitorDailyReducer } from '../../../src/app/store/reducers/power-monitor.daily.reducer';
import {
    loadDailyMonitorData,
    loadDailyMonitorDataFailure,
} from '../../../src/app/store/actions/power-monitor.daily.actions';

describe('powerMonitorDailyReducer', () => {
    it('should return the initial state', () => {
        const state = powerMonitorDailyReducer(undefined, { type: 'unknown' } as any);
        expect(state).toEqual({
            data: [],
            powerSum: 0,
            powerAvg: 0,
            forecast: 0,
            date: null,
            loading: false,
            error: null,
        });
    });

    it('should set loading true on loadDailyMonitorData', () => {
        const state = powerMonitorDailyReducer(
            undefined,
            loadDailyMonitorData({ date: new Date() }),
        );
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should set error on loadDailyMonitorDataFailure', () => {
        const error = 'fail';
        const state = powerMonitorDailyReducer(undefined, loadDailyMonitorDataFailure({ error }));
        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
    });
});
