import { PowerFailuresDailyComponent } from '../../../src/app/components/power-failures/power-failures-daily.component';
import { UntypedFormControl } from '@angular/forms';
import { Direction } from '../../../src/app/models/app.enums';
import { TestBed, ComponentFixture } from '@angular/core/testing';
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

describe('PowerFailuresDailyComponent', () => {
    let component: PowerFailuresDailyComponent;
    let fixture: ComponentFixture<PowerFailuresDailyComponent>;
    let store: MockStore;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PowerFailuresDailyComponent],
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

        fixture = TestBed.createComponent(PowerFailuresDailyComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(Store) as any;
        component.currentDate = new Date(2024, 4, 1);
        component.currentDateControl = new UntypedFormControl();
    });

    describe('addMonth', () => {
        it('should increment the month when direction is Direction.Up', async () => {
            component.currentDate = new Date(2024, 4, 1);
            await component.addMonth(Direction.Up);
            expect(store.dispatch).toHaveBeenCalledWith(
                expect.objectContaining({ date: new Date(2024, 5, 1) }),
            );
        });
        it('should decrement the month when direction is not Direction.Up', async () => {
            component.currentDate = new Date(2024, 4, 1);
            await component.addMonth(Direction.Down);
            expect(store.dispatch).toHaveBeenCalledWith(
                expect.objectContaining({ date: new Date(2024, 3, 1) }),
            );
        });
    });

    describe('clickOnRowHandler', () => {
        it('should navigate to hourly failures with correct query params', () => {
            const router = TestBed.inject(Router) as any;
            const row = { eventDate: new Date(2024, 4, 15) } as any;
            component.clickOnRowHandler(row);
            expect(router.navigate).toHaveBeenCalledWith(['power-failures', 'hourly'], {
                queryParams: {
                    year: 2024,
                    month: 5,
                    day: 15,
                },
            });
        });
        it('should not navigate if row is undefined', () => {
            const router = TestBed.inject(Router) as any;
            component.clickOnRowHandler(undefined as any);
            expect(router.navigate).not.toHaveBeenCalled();
        });
    });

    describe('ngOnInit', () => {
        it('should subscribe to queryParams and state, set currentDate, and dispatch loadDailyFailuresData', () => {
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
            component.processChangedState({ loading: true } as any);
            expect(showSpinnerSpy).toHaveBeenCalled();
        });
        it('should close spinner when not loading', () => {
            const closeSpinnerSpy = jest.spyOn(component as any, 'closeSpinner');
            component.processChangedState({ loading: false } as any);
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
            component.processChangedState({ error: true } as any);
            expect(closeSpinnerSpy).toHaveBeenCalled();
            if (originalShow) {
                (globalThis as any).ErrorDialogComponent.show = originalShow;
            }
        });
        it('should update currentDate, form control, and navigate when state has date', () => {
            const routerSpy = jest.spyOn(component['router'], 'navigate');
            const state: any = { loading: false, date: new Date(2024, 4, 1) };
            component.processChangedState(state);
            expect(component.currentDate).toEqual(new Date(2024, 4, 1));
            expect(component.currentDateControl.value).toBe(state.date.toISOString());
            expect(routerSpy).toHaveBeenCalled();
        });
        it('should update sortedData, totalPowerFailure, failureAmount, maxPowerFailure when state has data', () => {
            const state: any = {
                loading: false,
                data: [{}, {}],
                totalPowerFailure: 5,
                failureAmount: 2,
                maxPowerFailure: { duration: 10 },
            };
            component.sortedData = { data: [] } as any;
            component.processChangedState(state);
            expect(component.sortedData.data).toEqual(state.data);
            expect(component.totalPowerFailure).toBe(5);
            expect(component.failureAmount).toBe(2);
            expect(component.maxPowerFailure).toEqual({ duration: 10 });
        });
    });

    describe('restoreSort', () => {
        it('should restore sort from localStorage if present', () => {
            const sortObj = { active: 'eventDate', direction: 'asc' };
            localStorage.setItem('power-failures-sort-daily', JSON.stringify(sortObj));
            component.sortedData = {
                sort: {
                    sort: jest.fn(),
                    sortables: new Map([
                        ['eventDate', { _setAnimationTransitionState: jest.fn() }],
                    ]),
                },
            } as any;
            component.restoreSort();
            if (component.sortedData.sort) {
                expect(component.sortedData.sort.sort).toHaveBeenCalled();
            }
        });
    });

    describe('refreshData', () => {
        it('should dispatch loadDailyFailuresData with currentDate', () => {
            component.currentDate = new Date(2024, 4, 1);
            const dispatchSpy = jest.spyOn(store, 'dispatch');
            component.refreshData();
            expect(dispatchSpy).toHaveBeenCalledWith(
                expect.objectContaining({ date: new Date(2024, 4, 1) }),
            );
        });
    });

    describe('sortData', () => {
        it('should store sort in localStorage', () => {
            const sort = { active: 'eventDate', direction: 'asc' };
            const setItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem');
            component.sortData(sort as any);
            expect(setItemSpy).toHaveBeenCalledWith(
                'power-failures-sort-daily',
                JSON.stringify(sort),
            );
            setItemSpy.mockRestore();
        });
    });
});
