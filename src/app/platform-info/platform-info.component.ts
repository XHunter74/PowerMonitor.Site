import { Component, OnInit } from '@angular/core';
import { ServicesService } from '../services/services-service';
import { ISystemInfo } from '../models/sysinfo.model';
import { AppBaseComponent } from '../base-component/app-base.component';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { environment } from '../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-platform-info',
    templateUrl: './platform-info.component.html'
})
export class PlatformInfoComponent extends AppBaseComponent implements OnInit {

    public sysInfo: ISystemInfo;
    siteVersion: string;

    constructor(private servicesService: ServicesService,
        dialog: MatDialog,
        translate: TranslateService) {
        super(dialog, translate);
        this.siteVersion = environment.version;
    }

    ngOnInit(): void {
        this.refreshData();
    }

    async refreshData() {
        setTimeout(async () => {
            this.showSpinner();
            try {
                this.sysInfo = await this.servicesService.getSystemInfo();
                this.closeSpinner();
            } catch (e) {
                this.closeSpinner();
                const errorText = await this.translate.get('ERRORS.COMMON').toPromise();
                setTimeout(() => ErrorDialogComponent.show(this.dialog, errorText));
            }
        });
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

