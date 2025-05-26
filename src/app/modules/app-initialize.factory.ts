import { Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LOCATION_INITIALIZED } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../../environments/environment';
import { Constants } from '../shared/constants';

export function appInitializerFactory(translate: TranslateService, injector: Injector) {
    return () =>
        new Promise<any>((resolve: any) => {
            const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
            locationInitialized.then(() => {
                const langToSet = (localStorage.getItem(Constants.AppLanguage) as string) || 'en';
                translate.setDefaultLang(environment.defaultLocale);
                translate.use(langToSet).subscribe({
                    next: () => {
                        console.info(`Successfully initialized '${langToSet}' language.'`);
                    },
                    error: () => {
                        console.error(`Problem with '${langToSet}' language initialization.'`);
                    },
                    complete: () => {
                        resolve(null);
                    },
                });
            });
        });
}

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(httpClient);
}
