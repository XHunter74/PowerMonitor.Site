import { createReducer, on } from '@ngrx/store';
import { loadPlatformInfo, loadPlatformInfoSuccess, loadPlatformInfoFailure } from '../actions/platform-info.actions';
import { ISystemInfo } from '../../models/sysinfo.model';
import { IBoardInfoModel } from '../../models/board-info.model';

export interface PlatformInfoState {
    sysInfo: ISystemInfo | null;
    boardInfo: IBoardInfoModel | null;
    loading: boolean;
    error: any;
}

const initialState: PlatformInfoState = {
    sysInfo: null,
    boardInfo: null,
    loading: false,
    error: null,
};

export const platformInfoReducer = createReducer(
    initialState,
    on(loadPlatformInfo, (state) => ({ ...state, loading: true, error: null })),
    on(loadPlatformInfoSuccess, (state, { sysInfo, boardInfo }) => ({
        ...state,
        sysInfo,
        boardInfo,
        loading: false,
    })),
    on(loadPlatformInfoFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    }))
);