import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServicesService } from '../services/services-service'
import { from } from 'rxjs';
import { ISystemInfo } from '../models/sysinfo.model';

@Component({
    selector: 'app-platform-info',
    templateUrl: './platform-info.component.html'
})
export class PlatformInfoComponent {

    public sysInfo: ISystemInfo;

    constructor(http: HttpClient, private servicesService: ServicesService) {
        this.refreshData();
    }

    async refreshData() {
        try {
              this.sysInfo = await this.servicesService.getSystemInfo();
        } catch (e) {
            alert("Something going wrong!");
        }
    }
}

