import { UntypedFormControl, NgControl } from '@angular/forms';
import { Constants } from '../../../src/app/constants';
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
            declarations: [PowerMonitorDailyComponent, MockMatDatepickerInputDirective],
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
        component.addMonth('up');
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

    it('should disable addMonth button correctly', () => {
        component.currentDate = new Date('2024-05-01');
        // up: future beyond current month
        expect(component.isAddMonthButtonDisabled('up')).toBe(false);
        // down: before systemStartDate base
        const old = new Date(2000, 0, 1);
        // Override the static systemStartDate on Constants
        Constants.systemStartDate = old;
        component.currentDate = new Date(2000, 0, 2);
        expect(component.isAddMonthButtonDisabled('down')).toBe(false);
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
});
