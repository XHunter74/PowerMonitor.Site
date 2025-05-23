import { powerMonitorHourlyReducer } from '../../../src/app/store/reducers/power-monitor.hourly.reducer';
import {
    loadHourlyMonitorData,
    loadHourlyMonitorDataFailure,
} from '../../../src/app/store/actions/power-monitor.hourly.actions';

describe('powerMonitorHourlyReducer', () => {
    it('should return the initial state', () => {
        const state = powerMonitorHourlyReducer(undefined, { type: 'unknown' } as any);
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

    it('should set loading true on loadHourlyMonitorData', () => {
        const state = powerMonitorHourlyReducer(
            undefined,
            loadHourlyMonitorData({ date: new Date() }),
        );
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should set error on loadHourlyMonitorDataFailure', () => {
        const error = 'fail';
        const state = powerMonitorHourlyReducer(undefined, loadHourlyMonitorDataFailure({ error }));
        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
    });
});
