import {
    platformInfoReducer,
    PlatformInfoState,
} from '../../../src/app/store/reducers/platform-info.reducer';
import {
    loadPlatformInfo,
    loadPlatformInfoSuccess,
    loadPlatformInfoFailure,
} from '../../../src/app/store/actions/platform-info.actions';

describe('platformInfoReducer', () => {
    const initialState: PlatformInfoState = {
        sysInfo: null,
        loading: false,
        error: null,
    };

    it('should set loading true on loadPlatformInfo', () => {
        const state = platformInfoReducer(initialState, loadPlatformInfo());
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('should update sysInfo on success', () => {
        const sysInfo = {} as any;
        const state = platformInfoReducer(initialState, loadPlatformInfoSuccess({ sysInfo }));
        expect(state.sysInfo).toBe(sysInfo);
        expect(state.loading).toBe(false);
    });

    it('should set error on failure', () => {
        const error = 'error';
        const state = platformInfoReducer(initialState, loadPlatformInfoFailure({ error }));
        expect(state.loading).toBe(false);
        expect(state.error).toBe(error);
    });
});
