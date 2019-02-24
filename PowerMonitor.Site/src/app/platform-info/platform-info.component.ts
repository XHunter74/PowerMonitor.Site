import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesService } from '../services/services-service'
import { ISystemInfo } from '../models/sysinfo.model';
import { MatDialogRef, MatDialog } from '@angular/material';
import { SpinnerDialogComponent } from '../spinner-dialog/spinner-dialog.component';

@Component({
    selector: 'app-platform-info',
    templateUrl: './platform-info.component.html'
})
export class PlatformInfoComponent implements OnDestroy{

    public sysInfo: ISystemInfo;
    private dialogRef: MatDialogRef<SpinnerDialogComponent>;

    constructor(http: HttpClient,
        private servicesService: ServicesService,
        private dialog: MatDialog) {
        this.refreshData();
    }

    ngOnDestroy(): void {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }

    async refreshData() {
        setTimeout(() => {
            this.dialogRef = this.dialog.open(SpinnerDialogComponent, {
                panelClass: 'transparent',
                disableClose: true
            });
        });
        try {
            this.sysInfo = await this.servicesService.getSystemInfo();
        } catch (e) {
            alert("Something going wrong!");
        } finally {
            this.dialogRef.close();
        }
    }
}

