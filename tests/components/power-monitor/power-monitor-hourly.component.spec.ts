import { UntypedFormControl, NgControl } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Directive, Input } from '@angular/core';
import { PowerMonitorHourlyComponent } from '../../../src/app/components/power-monitor/power-monitor-hourly.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../../../src/app/shared/constants';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA, InjectionToken } from '@angular/core';
import { jest } from '@jest/globals';

export const TRANSLATE_TOKEN = new InjectionToken('translate');

// Mock NgControl for Material datepicker input
class MockNgControl extends NgControl {
    control = new UntypedFormControl();
    viewToModelUpdate() {}
}
// Minimal mock for MAT_DATE_FORMATS
export const MAT_MOCK_DATE_FORMATS = {
    parse: { dateInput: 'l' },
    display: {
        dateInput: 'l',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};
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
class MockRouter {
    navigate = jest.fn();
}
class MockDialog {}
class MockTranslateService {
    get = jest.fn(() => of('label'));
    onLangChange = of();
}

describe('PowerMonitorHourlyComponent', () => {
    // Mock directive to replace MatDatepickerInput
    @Directive({ selector: 'input[matInput][matDatepicker]' })
    class MockMatDatepickerInputDirective {
        @Input('matDatepicker') datepicker: any;
        @Input() dateChange: any;
        @Input() readonly: any;
        @Input() placeholder: any;
        @Input() value: any;
        @Input('formControl') formControl: any;
    }
    let component: PowerMonitorHourlyComponent;
    let fixture: ComponentFixture<PowerMonitorHourlyComponent>;
    let store: MockStore;
    let router: MockRouter;
    let translate: MockTranslateService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PowerMonitorHourlyComponent, MockMatDatepickerInputDirective],
            imports: [
                MatDialogModule,
                // MatDatepickerModule removed to prevent MatDatepickerInput instantiation
                TranslateModule.forRoot(),
                ReactiveFormsModule,
            ],
            providers: [
                { provide: Store, useClass: MockStore },
                { provide: 'dialog', useClass: MockDialog },
                { provide: TRANSLATE_TOKEN, useClass: MockTranslateService },
                { provide: 'dialog', useClass: MockDialog },
                { provide: 'translate', useClass: MockTranslateService },
                { provide: ActivatedRoute, useClass: MockActivatedRoute },
                { provide: Router, useClass: MockRouter },
                { provide: Router, useClass: MockRouter },
                { provide: Router, useClass: MockRouter },
                { provide: DateAdapter, useClass: MockDateAdapter },
                { provide: MAT_DATE_LOCALE, useValue: 'en' },
                { provide: MAT_DATE_FORMATS, useValue: MAT_MOCK_DATE_FORMATS },
                { provide: NgControl, useClass: MockNgControl },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        // Override template to eliminate Material datepicker inputs
        TestBed.overrideComponent(PowerMonitorHourlyComponent, {
            set: { template: '<div></div>' },
        });

        fixture = TestBed.createComponent(PowerMonitorHourlyComponent);
        component = fixture.componentInstance;
        // Ensure form control is present for datepicker
        component.currentDateControl = new UntypedFormControl();
        translate = TestBed.inject(TRANSLATE_TOKEN) as any;
        router = TestBed.inject(Router) as any;
        store = TestBed.inject(Store) as any;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should dispatch loadHourlyMonitorData on init', () => {
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

    it('should update chart data in prepareChart', () => {
        const data = [
            { hours: 0, power: 1 },
            { hours: 1, power: 2 },
            { hours: 2, power: 3 },
        ];
        component.barChartData = [{ data: [], label: 'Power, kW/h' }];
        component.prepareChart(data as any);
        expect(component.barChartData[0].data.length).toBe(24);
        expect(component.barChartLabels.length).toBe(24);
    });

    it('should disable addDay button correctly', () => {
        component.currentDate = new Date('2024-05-23');
        // up: future date
        expect(component.isAddDayButtonDisabled('up')).toBe(false);
        // down: before systemStartDate
        const oldDate = new Date(2000, 0, 1);
        // override the static systemStartDate
        Constants.systemStartDate = oldDate;
        component.currentDate = new Date(2000, 0, 2);
        expect(component.isAddDayButtonDisabled('down')).toBe(false);
    });

    it('should call prepareChart in processChangedState', () => {
        const spy = jest.spyOn(component, 'prepareChart');
        const state: any = {
            loading: false,
            data: [{ hours: 0, power: 1 }],
            powerSum: 1,
            powerAvg: 1,
            forecast: 2,
        };
        component.processChangedState(state);
        expect(spy).toHaveBeenCalled();
    });

    it('should fill missing hours with zeroed records', () => {
        // Only hours 0 and 2 are present
        const input = [
            { hours: 0, power: 5, created: new Date() },
            { hours: 2, power: 10, created: new Date() },
        ];
        const result = component.normalizeHourlyData(input as any);
        expect(result.length).toBe(Constants.HoursInDay);
        // Check hour 0 and 2 are preserved
        expect(result[0].power).toBe(5);
        expect(result[2].power).toBe(10);
        // Check hour 1 is zeroed
        expect(result[1].power).toBe(0);
        // Check all other hours are zeroed
        for (let i = 3; i < Constants.HoursInDay; i++) {
            expect(result[i].power).toBe(0);
            expect(result[i].hours).toBe(i);
        }
    });

    it('should return all zeroed records for empty input', () => {
        const result = component.normalizeHourlyData([]);
        expect(result.length).toBe(Constants.HoursInDay);
        for (let i = 0; i < Constants.HoursInDay; i++) {
            expect(result[i].power).toBe(0);
            expect(result[i].hours).toBe(i);
        }
    });

    it('should preserve all records if all hours are present', () => {
        const input: any = [];
        for (let i = 0; i < Constants.HoursInDay; i++) {
            input.push({ hours: i, power: i + 1, created: new Date() });
        }
        const result = component.normalizeHourlyData(input as any);
        expect(result.length).toBe(Constants.HoursInDay);
        for (let i = 0; i < Constants.HoursInDay; i++) {
            expect(result[i].power).toBe(i + 1);
            expect(result[i].hours).toBe(i);
        }
    });
});
