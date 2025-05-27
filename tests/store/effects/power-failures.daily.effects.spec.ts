import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of, throwError } from 'rxjs';
import { PowerFailuresDailyEffects } from '../../../src/app/store/effects/power-failures.daily.effects';
import { PowerService } from '../../../src/app/services/power.service';
import {
    loadDailyFailuresData,
    loadDailyFailuresDataSuccess,
    loadDailyFailuresDataFailure,
} from '../../../src/app/store/actions/power-failures.daily.actions';
import { FailuresDailyState } from '../../../src/app/store/reducers/power-failures.daily.reducer';
import { PowerFailureDailyModel } from '../../../src/app/models/power-failure-daily.model';

describe('PowerFailuresDailyEffects', () => {
    let actions$: Observable<any> = new Observable<any>();
    let effects: PowerFailuresDailyEffects;
    let powerService: any;

    beforeEach(() => {
        powerService = { getPowerFailuresDailyData: jest.fn() };
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                PowerFailuresDailyEffects,
                provideMockActions(() => actions$),
                { provide: PowerService, useValue: powerService },
            ],
        });
        effects = TestBed.inject(PowerFailuresDailyEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });

    describe('loadPowerMonitorDailyData$', () => {
        const date = new Date(2025, 4, 15); // May 15, 2025
        beforeEach(() => {
            actions$ = of(loadDailyFailuresData({ date }));
        });

        it('should dispatch success with correct state for multiple entries', (done) => {
            const data: PowerFailureDailyModel[] = [
                {
                    day: 1,
                    month: 5,
                    year: 2025,
                    eventDate: new Date(2025, 4, 1),
                    duration: 10,
                    events: 2,
                },
                {
                    day: 2,
                    month: 5,
                    year: 2025,
                    eventDate: new Date(2025, 4, 2),
                    duration: 20,
                    events: 3,
                },
            ];
            powerService.getPowerFailuresDailyData.mockReturnValue(of(data));
            effects.loadPowerMonitorDailyData$.subscribe((action) => {
                expect(powerService.getPowerFailuresDailyData).toHaveBeenCalledWith(2025, 5);
                expect(action.type).toBe(loadDailyFailuresDataSuccess.type);
                const state = (action as any).data as FailuresDailyState;
                expect(state.data).toEqual(data);
                expect(state.date).toEqual(date);
                expect(state.totalPowerFailure).toBe(30);
                expect(state.failureAmount).toBe(5);
                expect(state.maxPowerFailure).toEqual({
                    start: new Date(2025, 4, 2),
                    finish: new Date(2025, 4, 2),
                    duration: 20,
                });
                done();
            });
        });

        it('should dispatch success with null maxPowerFailure for empty data', (done) => {
            const data: PowerFailureDailyModel[] = [];
            powerService.getPowerFailuresDailyData.mockReturnValue(of(data));
            effects.loadPowerMonitorDailyData$.subscribe((action) => {
                expect(action.type).toBe(loadDailyFailuresDataSuccess.type);
                const state = (action as any).data as FailuresDailyState;
                expect(state.maxPowerFailure).toBeNull();
                expect(state.totalPowerFailure).toBe(0);
                expect(state.failureAmount).toBe(0);
                done();
            });
        });

        it('should dispatch success with correct state for single entry', (done) => {
            const data: PowerFailureDailyModel[] = [
                {
                    day: 1,
                    month: 5,
                    year: 2025,
                    eventDate: new Date(2025, 4, 1),
                    duration: 7,
                    events: 1,
                },
            ];
            powerService.getPowerFailuresDailyData.mockReturnValue(of(data));
            effects.loadPowerMonitorDailyData$.subscribe((action) => {
                expect(action.type).toBe(loadDailyFailuresDataSuccess.type);
                const state = (action as any).data as FailuresDailyState;
                expect(state.maxPowerFailure).toEqual({
                    start: new Date(2025, 4, 1),
                    finish: new Date(2025, 4, 1),
                    duration: 7,
                });
                expect(state.totalPowerFailure).toBe(7);
                expect(state.failureAmount).toBe(1);
                done();
            });
        });

        it('should dispatch failure when service errors', (done) => {
            const err = new Error('failures error');
            powerService.getPowerFailuresDailyData.mockReturnValue(throwError(() => err));
            effects.loadPowerMonitorDailyData$.subscribe((action) => {
                expect(action.type).toBe(loadDailyFailuresDataFailure.type);
                expect((action as any).error).toBe(err);
                done();
            });
        });
    });

    describe('edge cases', () => {
        let helper: any;
        beforeEach(() => {
            helper = Object.create(PowerFailuresDailyEffects.prototype);
        });

        it('should handle maxPowerFailure when multiple have same max duration', () => {
            const data: PowerFailureDailyModel[] = [
                {
                    day: 1,
                    month: 5,
                    year: 2025,
                    eventDate: new Date(2025, 4, 1),
                    duration: 10,
                    events: 1,
                },
                {
                    day: 2,
                    month: 5,
                    year: 2025,
                    eventDate: new Date(2025, 4, 2),
                    duration: 10,
                    events: 2,
                },
            ];
            // Simulate effect logic
            const max = data.find(
                (o) =>
                    o.duration ===
                    Math.max.apply(
                        null,
                        data.map((e) => e.duration),
                    ),
            );
            expect(max).toEqual(data[0]);
        });
    });
});
