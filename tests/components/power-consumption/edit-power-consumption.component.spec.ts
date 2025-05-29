import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPowerConsumptionComponent } from '../../../src/app/components/power-consumption/edit-power-consumption.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockTranslatePipe } from '../../mock-translate.pipe';
import { PowerMeteringDto } from '../../../src/app/models/power-metering.dto';

describe('EditPowerConsumptionComponent', () => {
    let component: EditPowerConsumptionComponent;
    let fixture: ComponentFixture<EditPowerConsumptionComponent>;
    let dialogRefSpy: { close: jest.Mock };

    beforeEach(async () => {
        // Suppress console.error and create MatDialogRef spy
        jest.spyOn(console, 'error').mockImplementation(() => {});
        dialogRefSpy = { close: jest.fn() };
        const dto = new PowerMeteringDto();
        dto.eventDate = new Date();
        await TestBed.configureTestingModule({
            declarations: [EditPowerConsumptionComponent],
            imports: [
                ReactiveFormsModule,
                MatInputModule,
                MatFormFieldModule,
                NgbTimepickerModule,
                NoopAnimationsModule,
                MockTranslatePipe,
            ],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: dto },
                { provide: MatDialogRef, useValue: dialogRefSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(EditPowerConsumptionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a form group', () => {
        expect(component.recordForm instanceof UntypedFormGroup).toBe(true);
    });

    // Test saveItem closes dialog with updated data based on form values
    it('should close dialog with updated data on saveItem', () => {
        const date = new Date(2025, 4, 1);
        component.eventDateField!.setValue(date);
        component.eventTimeField!.setValue({ hour: 10, minute: 30 });
        component.factualDataField!.setValue(456);
        component.saveItem();
        // Verify close was called with updated data
        expect(dialogRefSpy.close).toHaveBeenCalledWith(
            expect.objectContaining({
                eventDate: expect.any(Date),
                factualData: 456,
            }),
        );
        // Inspect the actual passed DTO
        const calls = dialogRefSpy.close.mock.calls;
        const passedDto = calls[calls.length - 1][0] as PowerMeteringDto;
        expect(passedDto.eventDate.getHours()).toBe(10);
        expect(passedDto.eventDate.getMinutes()).toBe(30);
    });
});
