import { IPowerDataDailyModel } from '../../../src/app/models/power-data-daily.model';
import { UntypedFormControl, NgControl } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PowerMonitorDailyComponent } from '../../../src/app/components/power-monitor/power-monitor-daily.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import {
    InjectionToken,
    NO_ERRORS_SCHEMA,
    Directive as NgDirective,
    Input as NgInput,
} from '@angular/core';
import { jest } from '@jest/globals';
import { Direction } from '../../../src/app/models/app.enums';

export const TRANSLATE_TOKEN = new InjectionToken('translate');

// Mock NgControl for Material datepicker input
class MockNgControl extends NgControl {
    control = new UntypedFormControl();
    viewToModelUpdate() {}
}

// Directive stub to replace MatDatepickerInput
@NgDirective({ selector: 'input[matInput][matDatepicker]' })
class MockMatDatepickerInputDirective {
    @NgInput('matDatepicker') datepicker: any;
    @NgInput() dateChange: any;
    @NgInput() readonly: any;
    @NgInput() placeholder: any;
    @NgInput() formControl: any;
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
    queryParams = of({ year: '2024', month: '05' });
}
class MockRouter {
    navigate = jest.fn();
}
class MockDialog {}
class MockTranslateService {
    get = jest.fn(() => of('label'));
    onLangChange = of();
}

describe('PowerMonitorDailyComponent', () => {
    let component: PowerMonitorDailyComponent;
    let fixture: ComponentFixture<PowerMonitorDailyComponent>;
    let store: MockStore;
    let router: MockRouter;
    let translate: MockTranslateService;

    beforeEach(async () => {
        const module = TestBed.configureTestingModule({
            declarations: [PowerMonitorDailyComponent],
            imports: [
                MatDialogModule,
                TranslateModule.forRoot(),
                ReactiveFormsModule,
                MockMatDatepickerInputDirective,
            ],
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
        module.overrideComponent(PowerMonitorDailyComponent, { set: { template: '<div></div>' } });
        await module.compileComponents();

        fixture = TestBed.createComponent(PowerMonitorDailyComponent);
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

    it('should dispatch loadDailyMonitorData on init', () => {
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
        const state: any = { date: new Date('2024-05-01'), data: [] };
        component.processChangedState(state);
        expect(router.navigate).toHaveBeenCalled();
    });

    it('should call store.dispatch on addMonth', () => {
        const spy = jest.spyOn(store, 'dispatch');
        component.currentDate = new Date('2024-05-01');
        component.addMonth(Direction.Up);
        expect(spy).toHaveBeenCalled();
    });

    it('should call store.dispatch on refreshData', () => {
        const spy = jest.spyOn(store, 'dispatch');
        component.currentDate = new Date('2024-05-01');
        component.refreshData();
        expect(spy).toHaveBeenCalled();
    });

    it('should update chart data in prepareChart', () => {
        const data = [{ created: new Date('2024-05-01').toISOString(), power: 5 }];
        component.barChartData = [{ data: [], label: 'Power, kW/h' }];
        component.prepareChart(new Date('2024-05-01'), data as any);
        expect(component.barChartData[0].data.length).toBe(31);
        expect(component.barChartLabels.length).toBe(31);
    });

    it('should call prepareChart in processChangedState', () => {
        const spy = jest.spyOn(component, 'prepareChart');
        const state: any = {
            loading: false,
            date: new Date('2024-05-01'),
            data: [{ created: new Date().toISOString(), power: 1 }],
            powerSum: 1,
            powerAvg: 1,
            forecast: 2,
        };
        component.processChangedState(state);
        expect(spy).toHaveBeenCalled();
    });
    it('should fill missing days with zeroed records', () => {
        const currentDate = new Date(2024, 4, 1); // May 2024
        // Only day 1 and 3 are present
        const input: IPowerDataDailyModel[] = [
            { created: new Date(2024, 4, 1), power: 5 },
            { created: new Date(2024, 4, 3), power: 10 },
        ];
        const result = component.normalizeDailyData(currentDate, input);
        expect(result.length).toBe(31); // May has 31 days
        // Check day 1 and 3 are preserved
        expect(result[0].power).toBe(5);
        expect(result[2].power).toBe(10);
        // Check day 2 is zeroed
        expect(result[1].power).toBe(0);
        // Check all other days are zeroed
        for (let i = 3; i < 31; i++) {
            if (i !== 2) {
                expect(result[i].power).toBe(0);
                expect(new Date(result[i].created).getDate()).toBe(i + 1);
            }
        }
    });

    it('should return all zeroed records for empty input', () => {
        const currentDate = new Date(2024, 4, 1); // May 2024
        const result = component.normalizeDailyData(currentDate, []);
        expect(result.length).toBe(31);
        for (let i = 0; i < 31; i++) {
            expect(result[i].power).toBe(0);
            expect(new Date(result[i].created).getDate()).toBe(i + 1);
        }
    });

    it('should preserve all records if all days are present', () => {
        const currentDate = new Date(2024, 4, 1); // May 2024
        const input: IPowerDataDailyModel[] = [];
        for (let i = 0; i < 31; i++) {
            input.push({ created: new Date(2024, 4, i + 1), power: i + 1 });
        }
        const result = component.normalizeDailyData(currentDate, input);
        expect(result.length).toBe(31);
        for (let i = 0; i < 31; i++) {
            expect(result[i].power).toBe(i + 1);
            expect(new Date(result[i].created).getDate()).toBe(i + 1);
        }
    });
});
