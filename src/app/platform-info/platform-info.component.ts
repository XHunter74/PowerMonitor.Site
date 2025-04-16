import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { environment } from '../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AppState } from '../store/reducers';
import { loadPlatformInfo } from '../store/actions/platform-info.actions';
import { PlatformInfoState } from '../store/reducers/platform-info.reducer';
import { Observable, Subscription } from 'rxjs';
import { IBoardInfoModel } from '../models/board-info.model';
import { ISystemInfo } from '../models/sysinfo.model';

@Component({
    selector: 'app-platform-info',
    templateUrl: './platform-info.component.html',
    styleUrls: ['./platform-info.component.css'],
})
export class PlatformInfoComponent extends AppBaseComponent implements OnInit {

    public platformInfoState$: Observable<PlatformInfoState>;
    stateSubscription: Subscription;
    siteVersion: string;
    public sysInfo: ISystemInfo;
    public boardInfo: IBoardInfoModel;

    constructor(
        private store: Store<AppState>,
        dialog: MatDialog,
        translate: TranslateService
    ) {
        super(dialog, translate);
        this.siteVersion = environment.version;
    }

    ngOnInit(): void {
        this.platformInfoState$ = this.store.select('platformInfo');
        this.stateSubscription = this.platformInfoState$.subscribe(state => {
            this.processChangedState(state);
        })
        this.store.dispatch(loadPlatformInfo());
    }

    ngOnDestroy(): void {
        if (this.stateSubscription) {
            this.stateSubscription.unsubscribe();
        }
        if (this.platformInfoState$) {
            this.platformInfoState$ = null;
        }
    }

    private processChangedState(state: PlatformInfoState) {
        if (state.loading) {
            this.showSpinner();
        } else {
            this.closeSpinner();
        }
        if (state.error) {
            this.translate.get('ERRORS.COMMON')
                .subscribe(errorText => {
                    ErrorDialogComponent.show(this.dialog, errorText);
                });
            return;
        }
        if (!state.loading && state.sysInfo && state.boardInfo) {
            this.sysInfo = state.sysInfo;
            this.boardInfo = state.boardInfo;
        }
    }

    getSystemUptimeStr() {
        let result = '';
        if (this.sysInfo.systemUptime.days) {
            result = result + `${this.sysInfo.systemUptime.days} days`;
        }
        if (this.sysInfo.systemUptime.hours) {
            result = result + ` ${this.sysInfo.systemUptime.hours.toString().padStart(2, '0')}:`;
        } else {
            result = result + ` 00:`;
        }
        if (this.sysInfo.systemUptime.minutes) {
            result = result + `${this.sysInfo.systemUptime.minutes.toString().padStart(2, '0')}:`;
        } else {
            result = result + `00:`;
        }
        result = result + `${this.sysInfo.systemUptime.seconds.toString().padStart(2, '0')}`;
        return result;
    }

    getSystemDateTime(): Date {
        const localDate = new Date(this.sysInfo.systemDateTimeStr)
        return localDate;
    }
}

