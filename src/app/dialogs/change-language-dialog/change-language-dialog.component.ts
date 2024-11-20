import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Constants } from '../../constants';

@Component({
    selector: 'app-dialog',
    templateUrl: './change-language-dialog.component.html',
    styleUrls: ['./change-language-dialog.component.css']
})
export class ChangeLanguageDialogComponent implements OnInit {

    languageList: any;
    form: UntypedFormGroup;

    static async show(dialog: MatDialog): Promise<string> {
        const dialogRef = dialog.open(ChangeLanguageDialogComponent, {
            width: '300px',
            height: '200px',
        });
        const dialogResult = await dialogRef.afterClosed().toPromise();
        return dialogResult;
    }

    constructor(@Inject(TranslateService) private translate: TranslateService,
        private fb: UntypedFormBuilder) {
        this.form = this.fb.group({
            languages: []
        });
    }

    ngOnInit() {
        this.languageList = this.getLanguagesSelectObj();
        const currentLang = this.translate.currentLang;
        this.getLangControl().setValue(currentLang);
    }

    getLangControl() {
        return this.form.controls['languages'];
    }

    getLanguagesSelectObj() {
        let obj: any[] = [];
        const items = environment.locales;
        items.forEach(el => {
            const name = this.matchLangName(el);
            obj.push({ id: el, name: name });
        });
        return obj;
    }

    matchLangName(lang: string) {
        const en = this.translate.instant('LANGUAGE.ENGLISH');
        const uk = this.translate.instant('LANGUAGE.UKRAINIAN');
        if (en && uk) {
            switch (lang) {
                case 'en': return en;
                case 'uk': return uk;
                default: return '---';
            }
        }
    }

    async saveLanguage() {
        const lang = this.getLangControl().value;
        if (lang !== this.translate.currentLang) {
            await this.translate.use(lang).toPromise();
            localStorage.setItem(Constants.AppLanguage, lang);
            console.info(`Successfully initialized '${lang}' language.`);
        }
    }
}
