import { PowerFailuresYearlyComponent } from '../../../src/app/components/power-failures/power-failures-yearly.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
// Minimal mock for DateAdapter
class MockDateAdapter {
    setLocale = jest.fn();
}

// Mock for formatDuration pipe
@Pipe({ name: 'formatDuration' })
class MockFormatDurationPipe implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}
// Mock for formatDurationWithDays pipe
@Pipe({ name: 'formatDurationWithDays' })
class MockFormatDurationWithDaysPipe implements PipeTransform {
    transform(value: any): any {
        return value;
    }
}

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

describe('PowerFailuresYearlyComponent', () => {
    let component: PowerFailuresYearlyComponent;
    let fixture: ComponentFixture<PowerFailuresYearlyComponent>;
    let store: MockStore;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                PowerFailuresYearlyComponent,
                MockFormatDurationPipe,
                MockFormatDurationWithDaysPipe,
            ],
            imports: [TranslateModule.forRoot()],
            providers: [
                { provide: Store, useClass: MockStore },
                { provide: Router, useClass: MockRouter },
                { provide: MatDialog, useClass: MockDialog },
                { provide: TranslateService, useClass: MockTranslateService },
                { provide: DateAdapter, useValue: { setLocale: jest.fn() } },
                { provide: DateAdapter, useClass: MockDateAdapter },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PowerFailuresYearlyComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(Store) as any;
    });

    describe('ngOnInit', () => {
        it('should subscribe to state, set sort, restoreSort, and dispatch loadYearlyFailuresData', () => {
            const storeDispatchSpy = jest.spyOn(store, 'dispatch');
            component.sortedData = { sort: { sort: jest.fn(), sortables: new Map() } } as any;
            const restoreSortSpy = jest.spyOn(component, 'restoreSort');
            component.ngOnInit();
            expect(restoreSortSpy).toHaveBeenCalled();
            expect(storeDispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ data: null }));
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
            const sortObj = { active: 'year', direction: 'asc' };
            localStorage.setItem('power-failures-sort-yearly', JSON.stringify(sortObj));
            component.sortedData = {
                sort: {
                    sort: jest.fn(),
                    sortables: new Map([['year', { _setAnimationTransitionState: jest.fn() }]]),
                },
            } as any;
            component.restoreSort();
            if (component.sortedData.sort) {
                expect(component.sortedData.sort.sort).toHaveBeenCalled();
            }
        });
    });

    describe('refreshData', () => {
        it('should dispatch loadYearlyFailuresData with data: null', () => {
            const dispatchSpy = jest.spyOn(store, 'dispatch');
            component.refreshData();
            expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ data: null }));
        });
    });

    describe('sortData', () => {
        it('should store sort in localStorage', () => {
            const sort = { active: 'year', direction: 'asc' };
            const setItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem');
            component.sortData(sort as any);
            expect(setItemSpy).toHaveBeenCalledWith(
                'power-failures-sort-yearly',
                JSON.stringify(sort),
            );
            setItemSpy.mockRestore();
        });
    });

    describe('clickOnRowHandler', () => {
        it('should navigate to monthly failures with correct query params', () => {
            const router = TestBed.inject(Router) as any;
            const row = { year: 2024 } as any;
            component.clickOnRowHandler(row);
            expect(router.navigate).toHaveBeenCalledWith(['power-failures', 'monthly'], {
                queryParams: { year: 2024 },
            });
        });
        it('should not navigate if row is undefined', () => {
            const router = TestBed.inject(Router) as any;
            component.clickOnRowHandler(undefined as any);
            expect(router.navigate).not.toHaveBeenCalled();
        });
    });
});
