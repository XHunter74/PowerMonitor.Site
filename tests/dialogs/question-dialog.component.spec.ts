import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QuestionDialogComponent } from '../../src/app/dialogs/question-dialog/question-dialog.component';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionDialogDataDto } from '../../src/app/models/question-dialog-data.dto';

describe('QuestionDialogComponent', () => {
    describe('show static method', () => {
        let dialog: any;
        beforeEach(() => {
            dialog = {
                open: jest.fn().mockReturnValue({
                    afterClosed: () => of('positive'),
                }),
            };
        });

        it('should open dialog with default values if not provided', waitForAsync(async () => {
            const result = await QuestionDialogComponent.show(dialog, 'Q?');
            expect(dialog.open).toHaveBeenCalledWith(
                QuestionDialogComponent,
                expect.objectContaining({
                    width: '500px',
                    height: '170px',
                    data: expect.objectContaining({
                        question: 'Q?',
                        positiveButton: 'Yes',
                        negativeButton: 'No',
                    }),
                }),
            );
            expect(result).toBe('positive');
        }));

        it('should open dialog with custom button labels and width', waitForAsync(async () => {
            const result = await QuestionDialogComponent.show(dialog, 'Q2?', 'Y', 'N', '300px');
            expect(dialog.open).toHaveBeenCalledWith(
                QuestionDialogComponent,
                expect.objectContaining({
                    width: '300px',
                    height: '170px',
                    data: expect.objectContaining({
                        question: 'Q2?',
                        positiveButton: 'Y',
                        negativeButton: 'N',
                    }),
                }),
            );
            expect(result).toBe('positive');
        }));

        it('should resolve to the value returned by afterClosed', waitForAsync(async () => {
            dialog.open = jest.fn().mockReturnValue({
                afterClosed: () => of('negative'),
            });
            const result = await QuestionDialogComponent.show(dialog, 'Q3?');
            expect(result).toBe('negative');
        }));
    });
    let consoleErrorSpy: jasmine.Spy | jest.SpyInstance;
    let component: QuestionDialogComponent;
    let fixture: ComponentFixture<QuestionDialogComponent>;

    beforeEach(async () => {
        if (typeof spyOn === 'function') {
            consoleErrorSpy = spyOn(console, 'error').and.callFake(() => {});
        } else if (typeof jest !== 'undefined' && jest.spyOn) {
            consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        }
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
