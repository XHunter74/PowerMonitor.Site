import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of, throwError } from 'rxjs';
import { PowerMonitorMonthlyEffects } from '../../../src/app/store/effects/power-monitor.monthly.effects';
import { PowerService } from '../../../src/app/services/power.service';
import {
    loadMonthlyMonitorData,
    loadMonthlyMonitorDataSuccess,
    loadMonthlyMonitorDataFailure,
} from '../../../src/app/store/actions/power-monitor.monthly.actions';
import { MonitorMonthlyState } from '../../../src/app/store/reducers/power-monitor.monthly.reducer';

describe('PowerMonitorMonthlyEffects', () => {
    let actions$: Observable<any> = new Observable<any>();
    let effects: PowerMonitorMonthlyEffects;
    let powerService: any;

    beforeEach(() => {
        // set up stubbed PowerService
        powerService = { getPowerDataMonthly: jest.fn() };
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                PowerMonitorMonthlyEffects,
                provideMockActions(() => actions$),
                { provide: PowerService, useValue: powerService },
            ],
        });
        effects = TestBed.inject(PowerMonitorMonthlyEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });

    describe('loadPowerMonitorMonthlyData$', () => {
        const date = new Date(2025, 6, 15);
        const startDate = new Date(date.getFullYear(), 0, 1);
        const finishDate = new Date(date.getFullYear(), 11, 31);
        beforeEach(() => {
            // stub actions stream
            actions$ = of(loadMonthlyMonitorData({ date }));
        });

        it('should dispatch success when monthly data loads', (done) => {
            const sampleData = [
                { year: 2025, month: 1, power: 10 },
                { year: 2025, month: 2, power: 20 },
            ];
            // stub getAveragePower to known
            Object.defineProperty(effects, 'getAveragePower', { value: () => 15 });
            powerService.getPowerDataMonthly.mockReturnValue(of(sampleData));
            effects.loadPowerMonitorMonthlyData$.subscribe((action) => {
                expect(powerService.getPowerDataMonthly).toHaveBeenCalledWith(
                    startDate,
                    finishDate,
                );
                expect(action.type).toBe(loadMonthlyMonitorDataSuccess.type);
                const state = (action as any).data as MonitorMonthlyState;
                expect(state.data).toEqual(sampleData);
                expect(state.date).toEqual(startDate);
                expect(state.powerSum).toBe(30);
                expect(state.powerAvg).toBe(15);
                done();
            });
        });

        it('should dispatch failure when monthly data errors', (done) => {
            const err = new Error('monthly fail');
            powerService.getPowerDataMonthly.mockReturnValue(throwError(() => err));
            effects.loadPowerMonitorMonthlyData$.subscribe((action) => {
                expect(action.type).toBe(loadMonthlyMonitorDataFailure.type);
                expect((action as any).error).toBe(err);
                done();
            });
        });
    });

    describe('getAveragePower helper', () => {
        let helper: any;
        beforeEach(() => {
            helper = Object.create(PowerMonitorMonthlyEffects.prototype);
        });

        it('should return 0 for data length <= 1', () => {
            const avg = helper.getAveragePower([{ year: 2025, month: 5, power: 10 }]);
            expect(avg).toBe(0);
        });

        it('should compute simple average when no current or system months filtered out', () => {
            // assume today beyond these months
            const data = [
                { year: 2026, month: 6, power: 10 },
                { year: 2026, month: 7, power: 20 },
            ];
            const avg = helper.getAveragePower(data as any);
            expect(avg).toBe(15);
        });

        it('should compute average excluding current month entries when powerCurrentMonth is zero', () => {
            // today is May 27, 2025
            const data = [
                { year: 2025, month: 5, power: 0 }, // current month zero
                { year: 2025, month: 6, power: 60 },
                { year: 2025, month: 7, power: 30 },
            ];
            const avg = helper.getAveragePower(data as any);
            // powerSum = 60+30 =90, months=3-1=2 => avg=45
            expect(avg).toBe(45);
        });

        it('should include fractional month when current month has power', () => {
            // prepare data with current month positive power
            const now = new Date(2025, 4, 27); // May 27, 2025
            // Use fake timers to fix system time
            jest.useFakeTimers();
            jest.setSystemTime(now);
            // 31 days in May
            const data = [
                { year: 2025, month: 5, power: 10 },
                { year: 2025, month: 4, power: 20 },
            ];
            const avg = helper.getAveragePower(data as any);
            // reduceSumInt for month<=systemStart? ignore now, months=2-1 + 27/31 => 1+0.871=1.871
            // powerSum sum filter= power for month!=current? month4=20, powerSumCurrentMonth=10, total=30 => avg=30/1.871~16.03 => rounded 16.03
            // Based on 30 days in April: avg = 30 / (1 + 27/30) = 15.789..., rounded to 2 decimals
            expect(avg).toBeCloseTo(15.79, 2);
            // Restore real timers
            jest.useRealTimers();
        });
    });
});
