import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeLanguageDialogComponent } from '../../src/app/dialogs/change-language-dialog/change-language-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslatePipe } from '../mock-translate.pipe';
import { MockTranslateService } from '../mock-translate.service';
import { environment } from '../../src/environments/environment';

describe('ChangeLanguageDialogComponent', () => {
    let consoleErrorSpy: jasmine.Spy | jest.SpyInstance;
    let component: ChangeLanguageDialogComponent;
    let fixture: ComponentFixture<ChangeLanguageDialogComponent>;

    beforeEach(async () => {
        if (typeof spyOn === 'function') {
            consoleErrorSpy = spyOn(console, 'error').and.callFake(() => {});
        } else if (typeof jest !== 'undefined' && jest.spyOn) {
            consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        }
        await TestBed.configureTestingModule({
            declarations: [ChangeLanguageDialogComponent, MockTranslatePipe],
            providers: [{ provide: TranslateService, useClass: MockTranslateService }],
        }).compileComponents();

        fixture = TestBed.createComponent(ChangeLanguageDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize languageList and set form control value', () => {
        // ngOnInit is called in beforeEach, so just check the results
        expect(component.languageList).toBeDefined();
        expect(component.form).toBeDefined();
        // Should set the value to translate.currentLang (which is undefined in mock, so form value is undefined)
        expect(component.getLangControl().value).toBeUndefined();
    });

    it('should return language name for known codes', () => {
        // The mock translate service returns the key
        expect(component.matchLangName('en')).toBe('LANGUAGE.ENGLISH');
        expect(component.matchLangName('uk')).toBe('LANGUAGE.UKRAINIAN');
    });

    it('should return --- for unknown language code', () => {
        expect(component.matchLangName('fr')).toBe('---');
    });

    it('should build language select object from environment.locales', () => {
        // Mock environment.locales
        const originalEnv = { ...environment };
        (environment as any).locales = ['en', 'uk', 'fr'];
        const result = component.getLanguagesSelectObj();
        expect(result).toEqual([
            { id: 'en', name: 'LANGUAGE.ENGLISH' },
            { id: 'uk', name: 'LANGUAGE.UKRAINIAN' },
            { id: 'fr', name: '---' },
        ]);
        // Restore environment
        Object.assign(environment, originalEnv);
    });

    it('should return undefined from matchLangName if en or uk is falsy', () => {
        // Patch translate.instant to return falsy
        const origInstant = component['translate'].instant;
        component['translate'].instant = () => '';
        expect(component.matchLangName('en')).toBeUndefined();
        expect(component.matchLangName('uk')).toBeUndefined();
        component['translate'].instant = origInstant;
    });

    it('should not call translate.use or set localStorage if language is unchanged', () => {
        const spyUse = jest.spyOn(component['translate'], 'use');
        const spySet = jest.spyOn(window.localStorage.__proto__, 'setItem');
        component['translate'].currentLang = 'en';
        component.form.controls['languages'].setValue('en');
        component.saveLanguage();
        expect(spyUse).not.toHaveBeenCalled();
        expect(spySet).not.toHaveBeenCalled();
        spyUse.mockRestore();
        spySet.mockRestore();
    });

    it('should call translate.use, set localStorage, and log when language changes', () => {
        const spyUse = jest
            .spyOn(component['translate'], 'use')
            .mockReturnValue({ subscribe: (cb: any) => cb() } as any);
        const spySet = jest.spyOn(window.localStorage.__proto__, 'setItem');
        const spyLog = jest.spyOn(console, 'info').mockImplementation(() => {});
        component['translate'].currentLang = 'en';
        component.form.controls['languages'].setValue('uk');
        component.saveLanguage();
        expect(spyUse).toHaveBeenCalledWith('uk');
        expect(spySet).toHaveBeenCalledWith(expect.any(String), 'uk');
        expect(spyLog).toHaveBeenCalledWith(
            expect.stringContaining("Successfully initialized 'uk' language."),
        );
        spyUse.mockRestore();
        spySet.mockRestore();
        spyLog.mockRestore();
    });

    it('getLangControl should return the languages form control', () => {
        expect(component.getLangControl()).toBe(component.form.controls['languages']);
    });

    it('show static method should resolve with dialog result', async () => {
        // Mock MatDialog
        const dialogResult = 'result';
        const afterClosed = () => of(dialogResult);
        const dialog = { open: jest.fn(() => ({ afterClosed })) } as any;
        const result = await ChangeLanguageDialogComponent.show(dialog);
        expect(result).toBe(dialogResult);
    });
});
