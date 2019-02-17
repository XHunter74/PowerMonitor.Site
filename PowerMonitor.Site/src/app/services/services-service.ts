import { Injectable, Inject, Optional, SkipSelf } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { UsersService } from './users-service';

import { ISystemInfo } from '../models/sysinfo.model';
import { ServicesUtils } from './services-utils';


@Injectable({
    providedIn: 'root',
})
export class ServicesService {
    private baseUrl: string;

    constructor(private http: HttpClient,
        private userService: UsersService,
        @Inject('BASE_URL') baseUrl,
        @Optional() @SkipSelf() parentModule: ServicesService) {
        this.baseUrl = baseUrl;
        if (parentModule) {
            throw new Error(
                'ServicesService is already loaded. Import it in the AppModule only');
        }

    }

    async getSystemInfo(): Promise<ISystemInfo> {
        const authToken = localStorage.getItem('auth_token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `${authToken}`
        });

        let promise = new Promise<ISystemInfo>((resolve, reject) => {
            this.http
                .get<ISystemInfo>(this.baseUrl + 'services/sysinfo', { headers })
                .toPromise()
                .then(data => {
                    resolve(data);
                })
                .catch(e => {
                    try {
                        ServicesUtils.handleError(this.userService, e);
                    } catch{
                        reject({ error: 'Server error' });
                    }
                });
        });
        return promise;
    }
}
