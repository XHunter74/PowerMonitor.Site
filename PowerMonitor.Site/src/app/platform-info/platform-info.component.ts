import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesService } from '../services/services-service'
import { ISystemInfo } from '../models/sysinfo.model';
import { MatDialog } from '@angular/material';
import { AppBaseComponent } from '../base-component/app-base.component';

@Component({
    selector: 'app-platform-info',
    templateUrl: './platform-info.component.html'
})
export class PlatformInfoComponent extends AppBaseComponent implements OnInit {

    public sysInfo: ISystemInfo;

    constructor(private servicesService: ServicesService,
        dialog: MatDialog) {
        super(dialog);
    }

    ngOnInit(): void {
        this.refreshData();
    }

    async refreshData() {
        setTimeout(() => {
            this.showSpinner();
        });
        try {
            this.sysInfo = await this.servicesService.getSystemInfo();
        } catch (e) {
            setTimeout(() => alert('Something going wrong!'));
        } finally {
            this.dialogRef.close();
        }
    }
}

