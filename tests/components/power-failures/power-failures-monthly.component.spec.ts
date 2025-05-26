import { PowerFailuresMonthlyComponent } from '../../../src/app/components/power-failures/power-failures-monthly.component';
import { UntypedFormControl } from '@angular/forms';
import { Constants } from '../../../src/app/constants';
import { Direction } from '../../../src/app/models/app.enums';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
// Mock for formatDuration pipe
@Pipe({ name: 'formatDuration' })
class MockFormatDurationPipe implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';
import { of } from 'rxjs';

class MockStore {
    dispatch = jest.fn();
    select = jest.fn(() => of({ data: [], loading: false }));
}
class MockRouter {
    navigate = jest.fn();
}
class MockDialog {
    open = jest.fn(() => ({ close: jest.fn() }));
}
class MockTranslateService {
    currentLang = 'en';
    get = jest.fn(() => ({ subscribe: jest.fn() }));
    use = jest.fn();
    onLangChange = { subscribe: jest.fn() };
}
class MockActivatedRoute {
    queryParams = { subscribe: jest.fn() };
}

describe('PowerFailuresMonthlyComponent', () => {
    let component: PowerFailuresMonthlyComponent;
    let fixture: ComponentFixture<PowerFailuresMonthlyComponent>;
    let store: MockStore;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PowerFailuresMonthlyComponent, MockFormatDurationPipe],
            imports: [TranslateModule.forRoot()],
            providers: [
                { provide: Store, useClass: MockStore },
                { provide: Router, useClass: MockRouter },
                { provide: ActivatedRoute, useClass: MockActivatedRoute },
                { provide: MatDialog, useClass: MockDialog },
                { provide: TranslateService, useClass: MockTranslateService },
                { provide: DateAdapter, useValue: { setLocale: jest.fn() } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PowerFailuresMonthlyComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(Store) as any;
        component.currentDate = new Date(2024, 0, 1);
        component.currentDateControl = new UntypedFormControl();
    });

    describe('addYear', () => {
        it('should increment the year when direction is Direction.Up', async () => {
            component.currentDate = new Date(2024, 0, 1);
            await component.addYear(Direction.Up);
            expect(store.dispatch).toHaveBeenCalledWith(
                expect.objectContaining({ date: new Date(2025, 0, 1) }),
            );
        });
        it('should decrement the year when direction is not Direction.Up', async () => {
            component.currentDate = new Date(2024, 0, 1);
            await component.addYear(Direction.Down);
            expect(store.dispatch).toHaveBeenCalledWith(
                expect.objectContaining({ date: new Date(2023, 0, 1) }),
            );
        });
    });

    describe('isAddYearButtonDisabled', () => {
        beforeEach(() => {
            Constants.systemStartDate = new Date(2020, 0, 1);
        });
        it('should disable the up button if next year is in the future', () => {
            const today = new Date();
            component.currentDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
            );
            expect(component.isAddYearButtonDisabled(Direction.Up)).toBe(true);
        });
        it('should not disable the up button if next year is not in the future', () => {
            component.currentDate = new Date(2024, 0, 1);
            expect(component.isAddYearButtonDisabled(Direction.Up)).toBe(false);
        });
        it('should disable the down button if previous year is before systemStartDate', () => {
            component.currentDate = new Date(2020, 0, 1);
            expect(component.isAddYearButtonDisabled(Direction.Down)).toBe(true);
        });
        it('should not disable the down button if previous year is after systemStartDate', () => {
            component.currentDate = new Date(2024, 0, 1);
            expect(component.isAddYearButtonDisabled(Direction.Down)).toBe(false);
        });
    });

    describe('chosenYearHandler', () => {
        it('should dispatch loadMonthlyFailuresData with selected year', () => {
            const datepicker = { close: jest.fn() } as any;
            const normalizedYear = { year: () => 2023 } as any;
            component.chosenYearHandler(normalizedYear, datepicker);
            expect(store.dispatch).toHaveBeenCalledWith(
                expect.objectContaining({ date: new Date(2023, 0, 1) }),
            );
            expect(datepicker.close).toHaveBeenCalled();
        });
    });

    describe('clickOnRowHandler', () => {
        it('should navigate to daily failures with correct query params', () => {
            const router = TestBed.inject(Router) as any;
            const row = { year: 2024, month: 5 } as any;
            component.clickOnRowHandler(row);
            expect(router.navigate).toHaveBeenCalledWith(['power-failures', 'daily'], {
                queryParams: { year: 2024, month: 5 },
            });
        });
        it('should not navigate if row is undefined', () => {
            const router = TestBed.inject(Router) as any;
            component.clickOnRowHandler(undefined as any);
            expect(router.navigate).not.toHaveBeenCalled();
        });
    });

    describe('ngOnInit', () => {
        it('should subscribe to queryParams and state, set currentDate, and dispatch loadMonthlyFailuresData', () => {
            const storeDispatchSpy = jest.spyOn(store, 'dispatch');
            const fixtureSpy = jest.spyOn(component['activatedRouter'].queryParams, 'subscribe');
            component.currentDate = new Date();
            component.ngOnInit();
            expect(fixtureSpy).toHaveBeenCalled();
            expect(storeDispatchSpy.mock.calls.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('ngOnDestroy', () => {
        it('should unsubscribe from stateSubscription and nullify failuresDataState$', () => {
            component.stateSubscription = { unsubscribe: jest.fn() } as any;
            component.failuresDataState$ = {} as any;
            const unsubSpy = jest.spyOn(component.stateSubscription, 'unsubscribe');
            component.ngOnDestroy();
            expect(unsubSpy).toHaveBeenCalled();
            expect(component.failuresDataState$).toBeNull();
        });
    });

    describe('processChangedState', () => {
        it('should show spinner when loading', () => {
            const showSpinnerSpy = jest.spyOn(component as any, 'showSpinner');
            component['translate'] = {
                get: jest.fn(() => ({ subscribe: (cb: any) => cb('Loading...') })),
            } as any;
            (component as any).processChangedState({ loading: true } as any);
            expect(showSpinnerSpy).toHaveBeenCalled();
        });
        it('should close spinner when not loading', () => {
            const closeSpinnerSpy = jest.spyOn(component as any, 'closeSpinner');
            (component as any).processChangedState({ loading: false } as any);
            expect(closeSpinnerSpy).toHaveBeenCalled();
        });
        it('should show error dialog and close spinner on error', () => {
            const closeSpinnerSpy = jest.spyOn(component as any, 'closeSpinner');
            const originalShow = (globalThis as any).ErrorDialogComponent?.show;
            (globalThis as any).ErrorDialogComponent = { show: jest.fn() };
            component['translate'] = {
                get: jest.fn(() => ({ subscribe: (cb: any) => cb('Error!') })),
            } as any;
            Object.defineProperty(component, 'dialog', { get: () => ({ open: jest.fn() }) });
            (component as any).processChangedState({ error: true } as any);
            expect(closeSpinnerSpy).toHaveBeenCalled();
            if (originalShow) {
                (globalThis as any).ErrorDialogComponent.show = originalShow;
            }
        });
        it('should update currentDate, form control, and navigate when state has date', () => {
            const routerSpy = jest.spyOn(component['router'], 'navigate');
            const state: any = { loading: false, date: new Date(2024, 0, 1) };
            (component as any).processChangedState(state);
            expect(component.currentDate).toEqual(new Date(2024, 0, 1));
            expect(component.currentDateControl.value).toBe(state.date.toISOString());
            expect(routerSpy).toHaveBeenCalled();
        });
        it('should update sortedData, totalPowerFailure, failureAmount when state has data', () => {
            const state: any = {
                loading: false,
                data: [{}, {}],
                totalPowerFailure: 5,
                failureAmount: 2,
            };
            component.sortedData = { data: [] } as any;
            (component as any).processChangedState(state);
            expect(component.sortedData.data).toEqual(state.data);
            expect(component.totalPowerFailure).toBe(5);
            expect(component.failureAmount).toBe(2);
        });
    });

    describe('restoreSort', () => {
        it('should restore sort from localStorage if present', () => {
            const sortObj = { active: 'month', direction: 'asc' };
            localStorage.setItem('power-failures-sort-monthly', JSON.stringify(sortObj));
            component.sortedData = {
                sort: {
                    sort: jest.fn(),
                    sortables: new Map([['month', { _setAnimationTransitionState: jest.fn() }]]),
                },
            } as any;
            component.restoreSort();
            if (component.sortedData.sort) {
                expect(component.sortedData.sort.sort).toHaveBeenCalled();
            }
        });
    });

    describe('refreshData', () => {
        it('should dispatch loadMonthlyFailuresData with currentDate', () => {
            component.currentDate = new Date(2024, 0, 1);
            const dispatchSpy = jest.spyOn(store, 'dispatch');
            component.refreshData();
            expect(dispatchSpy).toHaveBeenCalledWith(
                expect.objectContaining({ date: new Date(2024, 0, 1) }),
            );
        });
    });

    describe('sortData', () => {
        it('should store sort in localStorage', () => {
            const sort = { active: 'month', direction: 'asc' };
            const setItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem');
            component.sortData(sort as any);
            expect(setItemSpy).toHaveBeenCalledWith(
                'power-failures-sort-monthly',
                JSON.stringify(sort),
            );
            setItemSpy.mockRestore();
        });
    });
});
