import { IPowerDataMonthlyModel } from '../../../src/app/models/power-data-monthly.model';
import { UntypedFormControl, NgControl } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Directive, Input } from '@angular/core';
import { PowerMonitorMonthlyComponent } from '../../../src/app/components/power-monitor/power-monitor-monthly.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { InjectionToken, NO_ERRORS_SCHEMA } from '@angular/core';
import { jest } from '@jest/globals';
import { Constants } from '../../../src/app/constants';

export const TRANSLATE_TOKEN = new InjectionToken('translate');

// Mock NgControl for Material datepicker input
class MockNgControl extends NgControl {
    control = new UntypedFormControl();
    viewToModelUpdate() {}
}

// Directive stub to replace MatDatepickerInput
@Directive({ selector: 'input[matInput][matDatepicker]' })
class MockMatDatepickerInputDirective {
    @Input('matDatepicker') datepicker: any;
    @Input() dateChange: any;
    @Input() readonly: any;
    @Input() placeholder: any;
    @Input() formControl: any;
}

// Minimal mock for DateAdapter
class MockDateAdapter {
    setLocale() {}
}

// Minimal mock date formats
export const MAT_MOCK_DATE_FORMATS = {
    parse: { dateInput: 'l' },
    display: {
        dateInput: 'l',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

// Mocks
class MockStore {
    select = jest.fn(() => of({ data: [], loading: false }));
    dispatch = jest.fn();
}
class MockActivatedRoute {
    queryParams = of({ year: '2024' });
}
class MockRouter {
    navigate = jest.fn();
}
class MockDialog {}
class MockTranslateService {
    get = jest.fn(() => of('label'));
    onLangChange = of();
}

describe('PowerMonitorMonthlyComponent', () => {
    let component: PowerMonitorMonthlyComponent;
    let fixture: ComponentFixture<PowerMonitorMonthlyComponent>;
    let store: MockStore;
    let router: MockRouter;
    let translate: MockTranslateService;

    beforeEach(async () => {
        const module = TestBed.configureTestingModule({
            declarations: [PowerMonitorMonthlyComponent, MockMatDatepickerInputDirective],
            imports: [MatDialogModule, TranslateModule.forRoot(), ReactiveFormsModule],
            providers: [
                { provide: Store, useClass: MockStore },
                { provide: 'dialog', useClass: MockDialog },
                { provide: TRANSLATE_TOKEN, useClass: MockTranslateService },
                { provide: 'translate', useClass: MockTranslateService },
                { provide: ActivatedRoute, useClass: MockActivatedRoute },
                { provide: Router, useClass: MockRouter },
                { provide: DateAdapter, useClass: MockDateAdapter },
                { provide: MAT_DATE_LOCALE, useValue: 'en' },
                { provide: MAT_DATE_FORMATS, useValue: MAT_MOCK_DATE_FORMATS },
                { provide: NgControl, useClass: MockNgControl },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        });
        // override template to avoid Material datepicker instantiation
        module.overrideComponent(PowerMonitorMonthlyComponent, {
            set: { template: '<div></div>' },
        });
        await module.compileComponents();

        fixture = TestBed.createComponent(PowerMonitorMonthlyComponent);
        component = fixture.componentInstance;
        // ensure form control for datepicker
        component.currentDateControl = new UntypedFormControl();
        store = TestBed.inject(Store) as any;
        router = TestBed.inject(Router) as any;
        translate = TestBed.inject(TRANSLATE_TOKEN) as any;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should dispatch loadMonthlyMonitorData on init', () => {
        const spy = jest.spyOn(store, 'dispatch');
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

    it('should unsubscribe on destroy', () => {
        component.stateSubscription = { unsubscribe: jest.fn() } as any;
        const unsub = jest.spyOn(component.stateSubscription!, 'unsubscribe');
        component.ngOnDestroy();
        expect(unsub).toHaveBeenCalled();
    });

    it('should call router.navigate when processing state with date', () => {
        const state: any = { date: new Date('2024-01-01'), data: [] };
        component.processChangedState(state);
        expect(router.navigate).toHaveBeenCalled();
    });

    it('should call store.dispatch on addYear', () => {
        const spy = jest.spyOn(store, 'dispatch');
        component.currentDate = new Date('2024-01-01');
        component.addYear('up');
        expect(spy).toHaveBeenCalled();
    });

    it('should call store.dispatch on refreshData', () => {
        const spy = jest.spyOn(store, 'dispatch');
        component.currentDate = new Date('2024-01-01');
        component.refreshData();
        expect(spy).toHaveBeenCalled();
    });

    it('should update chart data in prepareChart', () => {
        const data = [
            { month: 1, power: 10 },
            { month: 2, power: 20 },
        ];
        component.barChartData = [{ data: [], label: 'Power, kW/h' }];
        component.prepareChart(data as any);
        expect(component.barChartData[0].data.length).toBe(12);
        expect(component.barChartLabels.length).toBe(12);
    });

    it('should disable addYear button correctly', () => {
        component.currentDate = new Date('2024-01-01');
        // up beyond current year
        expect(component.isAddYearButtonDisabled('up')).toBe(false);
        // down before systemStartDate: should be disabled
        const old = new Date(2000, 0, 1);
        Constants.systemStartDate = old;
        component.currentDate = new Date(2000, 0, 2);
        expect(component.isAddYearButtonDisabled('down')).toBe(true);
        // down: enabled if not before systemStartDate
        component.currentDate = new Date(2001, 0, 2);
        expect(component.isAddYearButtonDisabled('down')).toBe(false);
    });

    it('should call prepareChart in processChangedState', () => {
        const spy = jest.spyOn(component, 'prepareChart');
        const state: any = {
            loading: false,
            date: new Date(),
            data: [{ month: 1, power: 1 }],
            powerSum: 1,
            powerAvg: 1,
        };
        component.processChangedState(state);
        expect(spy).toHaveBeenCalled();
    });

    it('should fill missing months with zeroed records', () => {
        // Only months 1 and 3 are present
        const input: IPowerDataMonthlyModel[] = [
            { month: 1, power: 5, year: 2024 },
            { month: 3, power: 10, year: 2024 },
        ];
        const result = component.normalizeMonthlyData(input);
        expect(result.length).toBe(12);
        // Check month 1 and 3 are preserved
        expect(result[0].power).toBe(5);
        expect(result[2].power).toBe(10);
        // Check month 2 is zeroed
        expect(result[1].power).toBe(0);
        // Check all other months are zeroed
        for (let i = 3; i < 12; i++) {
            expect(result[i].power).toBe(0);
            expect(result[i].month).toBe(i + 1);
        }
    });

    it('should return all zeroed records for empty input', () => {
        const result = component.normalizeMonthlyData([]);
        expect(result.length).toBe(12);
        for (let i = 0; i < 12; i++) {
            expect(result[i].power).toBe(0);
            expect(result[i].month).toBe(i + 1);
        }
    });

    it('should preserve all records if all months are present', () => {
        const input: IPowerDataMonthlyModel[] = [];
        for (let i = 0; i < 12; i++) {
            input.push({ month: i + 1, power: i + 1, year: 2024 });
        }
        const result = component.normalizeMonthlyData(input);
        expect(result.length).toBe(12);
        for (let i = 0; i < 12; i++) {
            expect(result[i].power).toBe(i + 1);
            expect(result[i].month).toBe(i + 1);
        }
    });
});
