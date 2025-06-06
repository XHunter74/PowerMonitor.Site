import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/modules/app.module';
import { environment } from './environments/environment';

export function getBaseUrl() {
    return environment.apiUrl;
}

const providers = [{ provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }];

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic(providers)
    .bootstrapModule(AppModule)
    .catch((err) => console.log(err));
