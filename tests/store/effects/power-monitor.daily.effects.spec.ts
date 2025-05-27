import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of, throwError } from 'rxjs';
import { PowerMonitorDailyEffects } from '../../../src/app/store/effects/power-monitor.daily.effects';
import { PowerService } from '../../../src/app/services/power.service';
import {
    loadDailyMonitorData,
    loadDailyMonitorDataSuccess,
    loadDailyMonitorDataFailure,
} from '../../../src/app/store/actions/power-monitor.daily.actions';
import { MonitorDailyState } from '../../../src/app/store/reducers/power-monitor.daily.reducer';

describe('PowerMonitorDailyEffects', () => {
    let actions$: Observable<any> = new Observable<any>();
    let effects: PowerMonitorDailyEffects;
    let powerService: any;

    beforeEach(() => {
        powerService = { getPowerDataDaily: jest.fn() };
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                PowerMonitorDailyEffects,
                provideMockActions(() => actions$),
                { provide: PowerService, useValue: powerService },
            ],
        });
        effects = TestBed.inject(PowerMonitorDailyEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });

    describe('loadPowerMonitorHourlyData$', () => {
        const date = new Date(2025, 4, 15); // May 15, 2025
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const finishDate = new Date(date.getFullYear(), date.getMonth(), 31);
        beforeEach(() => {
            actions$ = of(loadDailyMonitorData({ date }));
        });

        it('should dispatch success when daily data loads', (done) => {
            const sampleData = [
                { day: 1, power: 10 },
                { day: 2, power: 20 },
            ];
            Object.defineProperty(effects, 'getAveragePower', { value: () => 15 });
            Object.defineProperty(effects, 'getPowerForecast', { value: () => 465 });
            powerService.getPowerDataDaily.mockReturnValue(of(sampleData));
            effects.loadPowerMonitorHourlyData$.subscribe((action) => {
                expect(powerService.getPowerDataDaily).toHaveBeenCalledWith(startDate, finishDate);
                expect(action.type).toBe(loadDailyMonitorDataSuccess.type);
                const state = (action as any).data as MonitorDailyState;
                expect(state.data).toEqual(sampleData);
                expect(state.date).toEqual(startDate);
                expect(state.powerSum).toBe(30);
                expect(state.powerAvg).toBe(15);
                expect(state.forecast).toBe(465);
                done();
            });
        });

        it('should dispatch failure when daily data errors', (done) => {
            const err = new Error('daily fail');
            powerService.getPowerDataDaily.mockReturnValue(throwError(() => err));
            effects.loadPowerMonitorHourlyData$.subscribe((action) => {
                expect(action.type).toBe(loadDailyMonitorDataFailure.type);
                expect((action as any).error).toBe(err);
                done();
            });
        });
    });

    describe('helper methods', () => {
        let helper: any;
        beforeEach(() => {
            helper = Object.create(PowerMonitorDailyEffects.prototype);
        });

        it('getPowerForecast returns forecast for current month', () => {
            // May 2025, 31 days
            const date = new Date(2025, 4, 1);
            jest.useFakeTimers();
            jest.setSystemTime(new Date(2025, 4, 15));
            const avg = 10;
            const forecast = helper.getPowerForecast(date, avg);
            expect(forecast).toBe(310);
            jest.useRealTimers();
        });

        it('getPowerForecast returns -1 for non-current month', () => {
            const date = new Date(2024, 4, 1);
            const avg = 10;
            const forecast = helper.getPowerForecast(date, avg);
            expect(forecast).toBe(-1);
        });

        it('getAveragePower returns 0 for empty data', () => {
            const avg = helper.getAveragePower(new Date(), 0, []);
            expect(avg).toBe(0);
        });

        it('getAveragePower computes average for full month', () => {
            const date = new Date(2025, 4, 1);
            const data = Array(31).fill({ power: 10 });
            const sum = 310;
            const avg = helper.getAveragePower(date, sum, data as any);
            expect(avg).toBeCloseTo(10.16, 2);
        });

        it('getAveragePower computes partial month average for current month', () => {
            // May 27, 2025, 31 days
            const date = new Date(2025, 4, 1);
            const data = Array(28).fill({ power: 10 });
            const sum = 280;
            jest.useFakeTimers();
            jest.setSystemTime(new Date(2025, 4, 27, 12, 0));
            const avg = helper.getAveragePower(date, sum, data as any);
            // days = 28-1 + (12/24) = 27.5, avg = 280/27.5 = 10.18
            expect(avg).toBeCloseTo(10.18, 2);
            jest.useRealTimers();
        });
    });
});
