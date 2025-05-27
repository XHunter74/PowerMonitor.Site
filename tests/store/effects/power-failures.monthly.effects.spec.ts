import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of, throwError } from 'rxjs';
import { PowerFailuresMonthlyEffects } from '../../../src/app/store/effects/power-failures.monthly.effects';
import { PowerService } from '../../../src/app/services/power.service';
import { TranslateService } from '@ngx-translate/core';
import {
    loadMonthlyFailuresData,
    loadMonthlyFailuresDataSuccess,
    loadMonthlyFailuresDataFailure,
} from '../../../src/app/store/actions/power-failures.monthly.actions';
import { FailuresMonthlyState } from '../../../src/app/store/reducers/power-failures.monthly.reducer';
import { PowerFailureMonthlyModel } from '../../../src/app/models/power-failure-monthly.model';
import { AuthService } from '../../../src/app/services/auth.service';
import { TranslateModule } from '@ngx-translate/core';

describe('PowerFailuresMonthlyEffects', () => {
    let actions$: Observable<any>;
    let effects: PowerFailuresMonthlyEffects;
    let powerService: any;
    let translate: any;

    beforeEach(() => {
        powerService = { getPowerFailuresMonthlyData: jest.fn() };
        translate = { get: jest.fn() };
        actions$ = new Observable<any>();
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, TranslateModule.forRoot()],
            providers: [
                PowerFailuresMonthlyEffects,
                provideMockActions(() => actions$),
                { provide: PowerService, useValue: powerService },
                { provide: TranslateService, useValue: translate },
            ],
        });
        effects = TestBed.inject(PowerFailuresMonthlyEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });

    describe('loadPowerMonitorMonthlyData$', () => {
        const date = new Date(2025, 4, 15);
        beforeEach(() => {
            actions$ = of(loadMonthlyFailuresData({ date }));
        });

        it('should dispatch success with correct state for multiple entries', (done) => {
            const data: PowerFailureMonthlyModel[] = [
                {
                    month: 5,
                    monthStr: '',
                    year: 2025,
                    eventDate: new Date(2025, 4, 1),
                    duration: 10,
                    events: 2,
                },
                {
                    month: 6,
                    monthStr: '',
                    year: 2025,
                    eventDate: new Date(2025, 5, 1),
                    duration: 20,
                    events: 3,
                },
            ];
            powerService.getPowerFailuresMonthlyData.mockReturnValue(of(data));
            // Mock translation for both months
            translate.get.mockImplementation((key: string) =>
                of(key === 'MONTHS.M4' ? 'May' : 'June'),
            );
            effects.loadPowerMonitorMonthlyData$.subscribe((action) => {
                expect(powerService.getPowerFailuresMonthlyData).toHaveBeenCalledWith(2025);
                expect(action.type).toBe(loadMonthlyFailuresDataSuccess.type);
                const state = (action as any).data as FailuresMonthlyState;
                expect(state.data.length).toBe(2);
                expect(state.data[0].monthStr).toContain('May');
                expect(state.data[1].monthStr).toContain('June');
                expect(state.date).toEqual(date);
                expect(state.totalPowerFailure).toBe(30);
                expect(state.failureAmount).toBe(5);
                done();
            });
        });

        it('should dispatch success with correct state for single entry', (done) => {
            const data: PowerFailureMonthlyModel[] = [
                {
                    month: 5,
                    monthStr: '',
                    year: 2025,
                    eventDate: new Date(2025, 4, 1),
                    duration: 7,
                    events: 1,
                },
            ];
            powerService.getPowerFailuresMonthlyData.mockReturnValue(of(data));
            translate.get.mockReturnValue(of('May'));
            effects.loadPowerMonitorMonthlyData$.subscribe((action) => {
                expect(action.type).toBe(loadMonthlyFailuresDataSuccess.type);
                const state = (action as any).data as FailuresMonthlyState;
                expect(state.data.length).toBe(1);
                expect(state.data[0].monthStr).toContain('May');
                expect(state.totalPowerFailure).toBe(7);
                expect(state.failureAmount).toBe(1);
                done();
            });
        });

        it('should dispatch success with empty data', (done) => {
            const data: PowerFailureMonthlyModel[] = [];
            powerService.getPowerFailuresMonthlyData.mockReturnValue(of(data));
            effects.loadPowerMonitorMonthlyData$.subscribe((action) => {
                expect(action.type).toBe(loadMonthlyFailuresDataSuccess.type);
                const state = (action as any).data as FailuresMonthlyState;
                expect(state.data.length).toBe(0);
                expect(state.totalPowerFailure).toBe(0);
                expect(state.failureAmount).toBe(0);
                done();
            });
        });

        it('should dispatch failure when service errors', (done) => {
            const err = new Error('failures error');
            powerService.getPowerFailuresMonthlyData.mockReturnValue(throwError(() => err));
            effects.loadPowerMonitorMonthlyData$.subscribe((action) => {
                expect(action.type).toBe(loadMonthlyFailuresDataFailure.type);
                expect((action as any).error).toBe(err);
                done();
            });
        });
    });
});
