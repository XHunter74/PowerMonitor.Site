import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Constants } from '../../shared/constants';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-dialog',
    templateUrl: './change-language-dialog.component.html',
    styleUrls: ['./change-language-dialog.component.css'],
    standalone: false,
})
export class ChangeLanguageDialogComponent implements OnInit {
    languageList: any;
    form: UntypedFormGroup;
    currentLang: string;

    static async show(dialog: MatDialog): Promise<string> {
        const dialogRef = dialog.open(ChangeLanguageDialogComponent, {
            width: '300px',
            height: '200px',
        });
        const dialogResult = await firstValueFrom(dialogRef.afterClosed());
        return dialogResult;
    }

    constructor(
        @Inject(TranslateService) private translate: TranslateService,
        private fb: UntypedFormBuilder,
    ) {
        this.form = this.fb.group({
            languages: [],
        });
    }

    ngOnInit() {
        this.languageList = this.getLanguagesSelectObj();
        this.currentLang = this.translate.currentLang;
    }

    getLanguagesSelectObj() {
        const obj: any[] = [];
        const items = environment.locales;
        items.forEach((el) => {
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
                case 'en':
                    return en;
                case 'uk':
                    return uk;
                default:
                    return '---';
            }
        }
    }

    saveLanguage() {
        if (this.currentLang !== this.translate.currentLang) {
            this.translate.use(this.currentLang).subscribe(() => {
                localStorage.setItem(Constants.AppLanguage, this.currentLang);
                console.info(`Successfully initialized '${this.currentLang}' language.`);
            });
        }
    }
}
