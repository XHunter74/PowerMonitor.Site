import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoltageAmperageHourlyComponent } from '../../../src/app/components/voltage-amperage/voltage-amperage-hourly.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
// Minimal mock for DateAdapter
class MockDateAdapter {
    setLocale() {}
}

// Mocks
class MockStore {
    select = jest.fn(() => of({ data: [], loading: false }));
    dispatch = jest.fn();
}

class MockActivatedRoute {
    queryParams = of({ year: '2024', month: '05', day: '23' });
}

import { jest } from '@jest/globals';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Constants } from '../../../src/app/constants';

class MockRouter {
    navigate = jest.fn();
}

describe('VoltageAmperageHourlyComponent', () => {
    let component: VoltageAmperageHourlyComponent;
    let fixture: ComponentFixture<VoltageAmperageHourlyComponent>;
    let store: MockStore;
    let router: Router;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VoltageAmperageHourlyComponent],
            imports: [
                MatDialogModule,
                MatSortModule,
                MatTableModule,
                TranslateModule.forRoot(),
                BrowserAnimationsModule,
            ],
            providers: [
                { provide: Store, useClass: MockStore },
                { provide: ActivatedRoute, useClass: MockActivatedRoute },
                { provide: Router, useClass: MockRouter },
                { provide: DateAdapter, useClass: MockDateAdapter },
                { provide: MAT_DATE_LOCALE, useValue: 'en' },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(VoltageAmperageHourlyComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(Store) as any;
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should dispatch loadVoltageAmperage on init', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        component.ngOnInit();
        expect(dispatchSpy).toHaveBeenCalled();
    });

    it('should unsubscribe on destroy', () => {
        component.stateSubscription = { unsubscribe: jest.fn() } as any;
        const unsubscribeSpy = jest.spyOn(component.stateSubscription, 'unsubscribe');
        component.ngOnDestroy();
        expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('should call router.navigate when processing state with date', () => {
        const state: any = { date: new Date('2024-05-23'), data: [] };
        component.processChangedState(state);
        expect(router.navigate).toHaveBeenCalled();
    });

    it('should call store.dispatch on addDay', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        component.currentDate = new Date('2024-05-23');
        component.addDay('up');
        expect(dispatchSpy).toHaveBeenCalled();
    });

    it('should call store.dispatch on refreshData', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        component.currentDate = new Date('2024-05-23');
        component.refreshData();
        expect(dispatchSpy).toHaveBeenCalled();
    });

    it('should update sortedData and min/max values on processReceivedData', () => {
        const state: any = {
            data: [1, 2, 3],
            maxVoltage: 10,
            minVoltage: 1,
            maxAmperage: 5,
            minAmperage: 0.5,
        };
        component.processReceivedData(state);
        expect(component.sortedData.data).toEqual([1, 2, 3]);
        expect(component.maxVoltage).toBe(10);
        expect(component.minVoltage).toBe(1);
        expect(component.maxAmperage).toBe(5);
        expect(component.minAmperage).toBe(0.5);
    });

    describe('restoreSort', () => {
        it('should restore sort from localStorage if present', () => {
            const sortObj = { active: 'created', direction: 'asc' };
            localStorage.setItem('voltage-amperage-hourly-sort', JSON.stringify(sortObj));
            component.sortedData = {
                sort: {
                    sort: jest.fn(),
                    sortables: new Map([['created', { _setAnimationTransitionState: jest.fn() }]]),
                },
            } as any;
            component.restoreSort();
            if (component.sortedData.sort) {
                expect(component.sortedData.sort.sort).toHaveBeenCalled();
            }
        });
    });

    describe('dateChanged', () => {
        it('should dispatch loadVoltageAmperage with selected date', () => {
            const event = { value: new Date(2025, 4, 25) } as MatDatepickerInputEvent<Date>;
            component.dateChanged(event);
            expect(store.dispatch).toHaveBeenCalledWith(
                expect.objectContaining({ date: new Date(2025, 4, 25) }),
            );
        });
    });

    describe('sortData', () => {
        it('should store sort in localStorage', () => {
            const sort = { active: 'created', direction: 'asc' };
            const setItemSpy = jest.spyOn(window.localStorage.__proto__, 'setItem');
            component.sortData(sort as any);
            expect(setItemSpy).toHaveBeenCalledWith(
                'voltage-amperage-hourly-sort',
                JSON.stringify(sort),
            );
            setItemSpy.mockRestore();
        });
    });

    describe('isAddDayButtonDisabled', () => {
        beforeEach(() => {
            Constants.systemStartDate = new Date(2020, 0, 1);
        });
        it('should disable the up button if next day is in the future', () => {
            const today = new Date(2025, 4, 26);
            component.currentDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate(),
            );
            expect(component.isAddDayButtonDisabled('up')).toBe(true);
        });
        it('should not disable the up button if next day is not in the future', () => {
            component.currentDate = new Date(2025, 4, 25);
            expect(component.isAddDayButtonDisabled('up')).toBe(false);
        });
        it('should disable the down button if previous day is before systemStartDate', () => {
            component.currentDate = new Date(2020, 0, 1);
            expect(component.isAddDayButtonDisabled('down')).toBe(true);
        });
        it('should not disable the down button if previous day is after systemStartDate', () => {
            component.currentDate = new Date(2025, 4, 26);
            expect(component.isAddDayButtonDisabled('down')).toBe(false);
        });
    });

    describe('processChangedState (edge cases)', () => {
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
    });
});
