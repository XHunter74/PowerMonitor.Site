import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerDialogComponent } from '../../src/app/dialogs/spinner-dialog/spinner-dialog.component';

describe('SpinnerDialogComponent', () => {
    it('should create', async () => {
        await TestBed.configureTestingModule({
            declarations: [SpinnerDialogComponent],
            imports: [MatProgressSpinnerModule],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: '' }],
        }).compileComponents();

        const fixture = TestBed.createComponent(SpinnerDialogComponent);
        const component = fixture.componentInstance;
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should set default message to "Loading..." when no data is provided', async () => {
        await TestBed.configureTestingModule({
            declarations: [SpinnerDialogComponent],
            imports: [MatProgressSpinnerModule],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: '' }],
        }).compileComponents();

        const fixture = TestBed.createComponent(SpinnerDialogComponent);
        const component = fixture.componentInstance;
        fixture.detectChanges();
        expect(component.message).toBe('Loading...');
    });

    it('should set message to provided data', async () => {
        const testMessage = 'Test loading message';
        await TestBed.configureTestingModule({
            declarations: [SpinnerDialogComponent],
            imports: [MatProgressSpinnerModule],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: testMessage }],
        }).compileComponents();

        const fixture = TestBed.createComponent(SpinnerDialogComponent);
        const component = fixture.componentInstance;
        fixture.detectChanges();
        expect(component.message).toBe(testMessage);
    });
});
