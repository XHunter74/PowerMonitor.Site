import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionDialogComponent } from '../../src/app/dialogs/question-dialog/question-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionDialogDataDto } from '../../src/app/models/question-dialog-data.dto';

describe('QuestionDialogComponent', () => {
    let component: QuestionDialogComponent;
    let fixture: ComponentFixture<QuestionDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [QuestionDialogComponent],
            providers: [
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: new QuestionDialogDataDto('Test?', 'Yes', 'No'),
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(QuestionDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have correct question and button labels', () => {
        expect(component.data.question).toBe('Test?');
        expect(component.data.positiveButton).toBe('Yes');
        expect(component.data.negativeButton).toBe('No');
    });

    it('should render question and button labels in the template', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.dialog-header')?.innerHTML).toContain('Test?');
        expect(compiled.querySelector('.ok-button')?.textContent).toContain('Yes');
        expect(compiled.querySelector('.cancel-button')?.textContent).toContain('No');
    });
});
