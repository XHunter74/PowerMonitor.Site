import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PowerConsumptionComponent } from '../../../src/app/components/power-consumption/power-consumption.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslatePipe } from '../../mock-translate.pipe';
import { MockTranslateService } from '../../mock-translate.service';

describe('PowerConsumptionComponent', () => {
    let component: PowerConsumptionComponent;
    let fixture: ComponentFixture<PowerConsumptionComponent>;

    let mockStore: { select: jest.Mock; dispatch: jest.Mock };

    beforeEach(async () => {
        mockStore = {
            select: jest.fn(() => ({ subscribe: jest.fn() })),
            dispatch: jest.fn(),
        };
        const { Store } = await import('@ngrx/store');
        // Provide a minimal DateAdapter mock
        class MockDateAdapter {
            format(date: Date) {
                return date.toString();
            }
            parse(value: any) {
                return new Date(value);
            }
            setLocale(_locale: string) {
                /* noop for test */
            }
        }
        const { DateAdapter } = await import('@angular/material/core');
        await TestBed.configureTestingModule({
            declarations: [PowerConsumptionComponent, MockTranslatePipe],
            imports: [MatTableModule],
            providers: [
                { provide: MatDialog, useValue: {} },
                { provide: TranslateService, useClass: MockTranslateService },
                { provide: Store, useValue: mockStore },
                { provide: DateAdapter, useClass: MockDateAdapter },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PowerConsumptionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should dispatch loadPowerConsumptionData on ngOnInit', async () => {
        mockStore.dispatch.mockClear();
        component.ngOnInit();
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: '[Power Consumption] Load Data' }),
        );
    });

    it('should call processChangedState when state changes', () => {
        const state = { loading: false, data: [{ id: 1 }], minItem: { id: 1 } };
        const spy = jest.spyOn(component, 'processChangedState' as any);
        component['processChangedState'](state as any);
        expect(spy).toHaveBeenCalledWith(state);
    });

    it('should call processChangedDeleteState when delete state changes', () => {
        const state = { loading: false, error: null, operationComplete: true };
        const spy = jest.spyOn(component, 'processChangedDeleteState' as any);
        component['processChangedDeleteState'](state as any);
        expect(spy).toHaveBeenCalledWith(state);
    });

    it('should call processChangedAddState when add state changes', () => {
        const state = { loading: false, error: null, operationComplete: true };
        const spy = jest.spyOn(component, 'processChangedAddState' as any);
        component['processChangedAddState'](state as any);
        expect(spy).toHaveBeenCalledWith(state);
    });

    it('should call processChangedEditState when edit state changes', () => {
        const state = { loading: false, error: null, operationComplete: true };
        const spy = jest.spyOn(component, 'processChangedEditState' as any);
        component['processChangedEditState'](state as any);
        expect(spy).toHaveBeenCalledWith(state);
    });

    it('should dispatch loadPowerConsumptionData on refreshData', async () => {
        mockStore.dispatch.mockClear();
        component.refreshData();
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: '[Power Consumption] Load Data' }),
        );
    });

    it('should dispatch deletePowerConsumptionData on deleteRecord after confirmation', async () => {
        mockStore.dispatch.mockClear();
        const { QuestionDialogComponent } = await import(
            '../../../src/app/dialogs/question-dialog/question-dialog.component'
        );
        const dialogResult = Promise.resolve('positive');
        jest.spyOn(QuestionDialogComponent, 'show').mockReturnValue(dialogResult);
        jest.spyOn(component['translate'], 'get').mockReturnValue({
            subscribe: (cb: any) =>
                cb({
                    'POWER_CONSUMPTION.DELETE_QUESTION': 'Delete?',
                    'COMMON.YES': 'Yes',
                    'COMMON.NO': 'No',
                }),
        } as any);
        await component.deleteRecord(123);
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: '[Power Consumption] Delete Data',
                recordId: 123,
            }),
        );
    });

    it('should not dispatch deletePowerConsumptionData if dialog result is not positive', async () => {
        const { Store } = await import('@ngrx/store');
        const store = TestBed.inject(Store);
        const { QuestionDialogComponent } = await import(
            '../../../src/app/dialogs/question-dialog/question-dialog.component'
        );
        const dialogResult = Promise.resolve('negative');
        jest.spyOn(QuestionDialogComponent, 'show').mockReturnValue(dialogResult);
        jest.spyOn(component['translate'], 'get').mockReturnValue({
            subscribe: (cb: any) =>
                cb({
                    'POWER_CONSUMPTION.DELETE_QUESTION': 'Delete?',
                    'COMMON.YES': 'Yes',
                    'COMMON.NO': 'No',
                }),
        } as any);
        await component.deleteRecord(123);
        expect(store.dispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({
                type: expect.stringContaining('deletePowerConsumptionData'),
                recordId: 123,
            }),
        );
    });

    it('should dispatch addPowerConsumptionData on addNewRecord', async () => {
        mockStore.dispatch.mockClear();
        const { EditPowerConsumptionComponent } = await import(
            '../../../src/app/components/power-consumption/edit-power-consumption.component'
        );
        const dialogResult = {
            eventDate: new Date(),
            factualData: 42,
            id: 1,
            monitorData: 0,
            difference: 0,
            hours: 0,
            coefficient: 0,
        };
        jest.spyOn(EditPowerConsumptionComponent, 'show').mockResolvedValue(dialogResult);
        component.sortedData.data = [{ monitorData: 99 }];
        await component.addNewRecord();
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: '[Power Consumption] Add Data' }),
        );
    });

    it('should not dispatch addPowerConsumptionData if dialog result is falsy', async () => {
        const { Store } = await import('@ngrx/store');
        const store = TestBed.inject(Store);
        const { EditPowerConsumptionComponent } = await import(
            '../../../src/app/components/power-consumption/edit-power-consumption.component'
        );
        jest.spyOn(EditPowerConsumptionComponent, 'show').mockResolvedValue(undefined as any);
        await component.addNewRecord();
        expect(store.dispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({ type: expect.stringContaining('addPowerConsumptionData') }),
        );
    });

    it('should dispatch editPowerConsumptionData on editRecord', async () => {
        mockStore.dispatch.mockClear();
        const { EditPowerConsumptionComponent } = await import(
            '../../../src/app/components/power-consumption/edit-power-consumption.component'
        );
        const dialogResult = {
            id: 1,
            eventDate: new Date(),
            factualData: 42,
            monitorData: 0,
            difference: 0,
            hours: 0,
            coefficient: 0,
        };
        jest.spyOn(EditPowerConsumptionComponent, 'show').mockResolvedValue(dialogResult);
        await component.editRecord({} as any);
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: '[Power Consumption] Edit Data' }),
        );
    });

    it('should not dispatch editPowerConsumptionData if dialog result is falsy', async () => {
        const { Store } = await import('@ngrx/store');
        const store = TestBed.inject(Store);
        const { EditPowerConsumptionComponent } = await import(
            '../../../src/app/components/power-consumption/edit-power-consumption.component'
        );
        jest.spyOn(EditPowerConsumptionComponent, 'show').mockResolvedValue(undefined as any);
        await component.editRecord({} as any);
        expect(store.dispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({ type: expect.stringContaining('editPowerConsumptionData') }),
        );
    });

    it('should return true for isDeleteButtonDisabled if elementId !== minId', () => {
        component.minId = 1;
        expect(component.isDeleteButtonDisabled(2)).toBe(true);
    });

    it('should return false for isDeleteButtonDisabled if elementId === minId', () => {
        component.minId = 1;
        expect(component.isDeleteButtonDisabled(1)).toBe(false);
    });
});
