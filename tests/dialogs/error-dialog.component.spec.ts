import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorDialogComponent } from '../../src/app/dialogs/error-dialog/error-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorDialogData } from '../../src/app/dialogs/Models/error-dialog-data';
import { MockTranslatePipe } from '../mock-translate.pipe';

describe('ErrorDialogComponent', () => {
    let consoleErrorSpy: jasmine.Spy | jest.SpyInstance;
    let component: ErrorDialogComponent;
    let fixture: ComponentFixture<ErrorDialogComponent>;

    beforeEach(async () => {
        if (typeof spyOn === 'function') {
            consoleErrorSpy = spyOn(console, 'error').and.callFake(() => {});
        } else if (typeof jest !== 'undefined' && jest.spyOn) {
            consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        }
        await TestBed.configureTestingModule({
            declarations: [ErrorDialogComponent],
            imports: [MockTranslatePipe],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: new ErrorDialogData('Test error!') }],
        }).compileComponents();

        fixture = TestBed.createComponent(ErrorDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have correct error message in data', () => {
        expect(component.data.errorMessage).toBe('Test error!');
    });

    it('should render error message in the template', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('h5')?.textContent).toContain('Test error!');
    });

    it('should render translated labels in the template', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.dialog-header')?.textContent).toContain('COMMON.ERROR');
        expect(compiled.querySelector('.ok-button')?.textContent).toContain('BUTTONS.OK');
    });
});
