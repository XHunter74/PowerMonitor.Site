import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoltageAmperageHourlyComponent } from '../../src/app/components/voltage-amperage/voltage-amperage-hourly.component';
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
});
