import { AppBaseComponent } from '../../../src/app/components/base-component/app-base.component';
import { SpinnerDialogComponent } from '../../../src/app/dialogs/spinner-dialog/spinner-dialog.component';
import { DateAdapter } from '@angular/material/core';
import * as ngCore from '@angular/core';

class TestAppBaseComponent extends AppBaseComponent {
    getDialogRef() {
        return this.dialogRef;
    }
    setDialogRef(val: any) {
        this.dialogRef = val;
    }
}

describe('AppBaseComponent', () => {
    let component: TestAppBaseComponent;
    let dialog: any;
    let translate: any;
    let dateAdapter: any;
    let dialogRef: any;

    beforeEach(() => {
        dialogRef = { close: jest.fn() };
        dialog = {
            open: jest.fn(() => dialogRef),
        };
        translate = {
            currentLang: 'en',
            use: jest.fn(),
            onLangChange: {
                subscribe: jest.fn((cb) => {
                    cb();
                    return { unsubscribe: jest.fn() };
                }),
            },
        };
        dateAdapter = { setLocale: jest.fn() };
        jest.spyOn(ngCore, 'inject').mockImplementation((token: any) => {
            if (token === DateAdapter) return dateAdapter;
            return undefined;
        });
        component = new TestAppBaseComponent(dialog, translate);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set default language if currentLang is falsy', () => {
        translate.currentLang = undefined;
        translate.use.mockClear();
        new AppBaseComponent(dialog, translate);
        expect(translate.use).toHaveBeenCalledWith('en');
    });

    it('should set dateAdapter locale on init and on language change', () => {
        expect(dateAdapter.setLocale).toHaveBeenCalledWith('en');
        // Simulate language change
        translate.currentLang = 'uk';
        translate.onLangChange.subscribe.mock.calls[0][0]();
        expect(dateAdapter.setLocale).toHaveBeenCalledWith('uk');
    });

    it('should open spinner dialog if not already open', () => {
        component.setDialogRef(null);
        const ref = component.showSpinner('Loading...');
        expect(dialog.open).toHaveBeenCalledWith(
            SpinnerDialogComponent,
            expect.objectContaining({ data: 'Loading...' }),
        );
        expect(ref).toBe(dialogRef);
    });

    it('should not open spinner dialog if already open', () => {
        component.setDialogRef(dialogRef);
        component.showSpinner('Loading...');
        expect(dialog.open).not.toHaveBeenCalled();
    });

    it('should close spinner dialog if open', () => {
        component.setDialogRef(dialogRef);
        component.closeSpinner();
        expect(dialogRef.close).toHaveBeenCalled();
        expect(component.getDialogRef()).toBeNull();
    });

    it('should do nothing on closeSpinner if dialogRef is null', () => {
        component.setDialogRef(null);
        expect(() => component.closeSpinner()).not.toThrow();
    });

    it('should close dialogRef on ngOnDestroy', () => {
        component.setDialogRef(dialogRef);
        component.ngOnDestroy();
        expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should do nothing on ngOnDestroy if dialogRef is null', () => {
        component.setDialogRef(null);
        expect(() => component.ngOnDestroy()).not.toThrow();
    });
});
