import { createReducer, on } from '@ngrx/store';
import {
    loadPlatformInfo,
    loadPlatformInfoSuccess,
    loadPlatformInfoFailure,
} from '../actions/platform-info.actions';
import { ISystemInfo } from '../../models/sysinfo.model';

export interface PlatformInfoState {
    sysInfo: ISystemInfo | null;
    loading: boolean;
    error: any;
}

const initialState: PlatformInfoState = {
    sysInfo: null,
    loading: false,
    error: null,
};

export const platformInfoReducer = createReducer(
    initialState,
    on(loadPlatformInfo, (state) => ({ ...state, loading: true, error: null })),
    on(loadPlatformInfoSuccess, (state, { sysInfo }) => ({
        ...state,
        sysInfo,
        loading: false,
    })),
    on(loadPlatformInfoFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),
);
