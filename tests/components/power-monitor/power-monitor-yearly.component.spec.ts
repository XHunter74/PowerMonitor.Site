import { UntypedFormControl, NgControl } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Directive, Input } from '@angular/core';
import { PowerMonitorYearlyComponent } from '../../../src/app/components/power-monitor/power-monitor-yearly.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { InjectionToken, NO_ERRORS_SCHEMA } from '@angular/core';
import { jest } from '@jest/globals';

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
class MockRouter {
    navigate = jest.fn();
}
class MockDialog {}
class MockTranslateService {
    get = jest.fn(() => of('label'));
    onLangChange = of();
}

describe('PowerMonitorYearlyComponent', () => {
    let component: PowerMonitorYearlyComponent;
    let fixture: ComponentFixture<PowerMonitorYearlyComponent>;
    let store: MockStore;
    let router: MockRouter;
    let translate: MockTranslateService;

    beforeEach(async () => {
        const module = TestBed.configureTestingModule({
            declarations: [PowerMonitorYearlyComponent, MockMatDatepickerInputDirective],
            imports: [MatDialogModule, TranslateModule.forRoot(), ReactiveFormsModule],
            providers: [
                { provide: Store, useClass: MockStore },
                { provide: 'dialog', useClass: MockDialog },
                { provide: TRANSLATE_TOKEN, useClass: MockTranslateService },
                { provide: 'translate', useClass: MockTranslateService },
                { provide: Router, useClass: MockRouter },
                { provide: DateAdapter, useClass: MockDateAdapter },
                { provide: MAT_DATE_LOCALE, useValue: 'en' },
                { provide: MAT_DATE_FORMATS, useValue: MAT_MOCK_DATE_FORMATS },
                { provide: NgControl, useClass: MockNgControl },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        });
        // override template to avoid Material datepicker instantiation
        module.overrideComponent(PowerMonitorYearlyComponent, {
            set: { template: '<div></div>' },
        });
        await module.compileComponents();

        fixture = TestBed.createComponent(PowerMonitorYearlyComponent);
        component = fixture.componentInstance;
        // ensure form control for datepicker
        store = TestBed.inject(Store) as any;
        router = TestBed.inject(Router) as any;
        translate = TestBed.inject(TRANSLATE_TOKEN) as any;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should dispatch loadYearlyMonitorData on init', () => {
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

    it('should call router.navigate when chartClicked', () => {
        component.barChartLabels = ['2022', '2023'];
        const event = { active: [{ index: 1 }] };
        component.chartClicked(event);
        expect(router.navigate).toHaveBeenCalledWith(['power-monitor', 'monthly'], {
            queryParams: { year: '2023' },
        });
    });

    it('should update chart data in prepareChart', () => {
        const data = [
            { year: 2022, power: 10 },
            { year: 2023, power: 20 },
        ];
        component.barChartData = [{ data: [], label: 'Power, kW/h' }];
        component.prepareChart(data as any);
        expect(component.barChartData[0].data.length).toBe(2);
        expect(component.barChartLabels.length).toBe(2);
    });

    it('should call prepareChart in processChangedState', () => {
        const spy = jest.spyOn(component, 'prepareChart');
        const state: any = {
            loading: false,
            data: [{ year: 2022, power: 1 }],
        };
        component.processChangedState(state);
        expect(spy).toHaveBeenCalled();
    });

    it('should call store.dispatch on refreshData', () => {
        const spy = jest.spyOn(store, 'dispatch');
        component.refreshData();
        expect(spy).toHaveBeenCalled();
    });
});
