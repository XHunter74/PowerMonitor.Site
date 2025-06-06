import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent {
    title = 'app';

    constructor(translate: TranslateService) {
        translate.setDefaultLang(environment.defaultLocale);
    }
}
