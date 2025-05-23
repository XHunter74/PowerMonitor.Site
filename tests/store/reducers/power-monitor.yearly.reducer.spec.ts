import { powerMonitorYearlyReducer } from '../../../src/app/store/reducers/power-monitor.yearly.reducer';
import {
    loadYearlyMonitorData,
    loadYearlyMonitorDataFailure,
} from '../../../src/app/store/actions/power-monitor.yearly.actions';

describe('powerMonitorYearlyReducer', () => {
    it('should return the initial state', () => {
        const state = powerMonitorYearlyReducer(undefined, { type: 'unknown' } as any);
        expect(state).toEqual({
            data: [],
            loading: true,
            error: null,
        });
    });

    it('should set loading true on loadYearlyMonitorData', () => {
        const state = powerMonitorYearlyReducer(undefined, loadYearlyMonitorData({ data: null }));
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should set error on loadYearlyMonitorDataFailure', () => {
        const error = 'fail';
        const state = powerMonitorYearlyReducer(undefined, loadYearlyMonitorDataFailure({ error }));
        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
    });
});
