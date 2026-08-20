import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of, throwError } from 'rxjs';
import { PowerMonitorHourlyEffects } from '../../../src/app/store/effects/power-monitor.hourly.effects';
import { AuthService } from '../../../src/app/services/auth.service';
import { PowerService } from '../../../src/app/services/power.service';
import {
    loadHourlyMonitorData,
    loadHourlyMonitorDataSuccess,
    loadHourlyMonitorDataFailure,
} from '../../../src/app/store/actions/power-monitor.hourly.actions';

describe('PowerMonitorHourlyEffects', () => {
    let actions$: Observable<any>;
    let effects: PowerMonitorHourlyEffects;

    beforeEach(() => {
        actions$ = new Observable<any>();
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [PowerMonitorHourlyEffects, provideMockActions(() => actions$), AuthService],
        });
        effects = TestBed.inject(PowerMonitorHourlyEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });

    describe('loadPowerMonitorHourlyData$', () => {
        const mockDate = new Date();
        const pastDate = new Date(mockDate.getTime() - 24 * 60 * 60 * 1000);
        let powerService: any;

        beforeEach(() => {
            // override PowerService with spies (Jest)
            powerService = {};
            powerService.getPowerDataHourly = jest.fn();
            powerService.getPowerDataStats = jest.fn();
            TestBed.resetTestingModule();
            TestBed.configureTestingModule({
                imports: [HttpClientTestingModule],
                providers: [
                    PowerMonitorHourlyEffects,
                    provideMockActions(() => actions$),
                    { provide: AuthService, useValue: {} },
                    { provide: PowerService, useValue: powerService },
                ],
            });
            effects = TestBed.inject(PowerMonitorHourlyEffects);
        });

        it('should dispatch success with hourly data for past date', (done) => {
            const hourlyData = [
                { hours: 0, power: 1 },
                { hours: 1, power: 2 },
            ];
            powerService.getPowerDataHourly.mockReturnValue(of(hourlyData));
            actions$ = of(loadHourlyMonitorData({ date: pastDate }));
            effects.loadPowerMonitorHourlyData$.subscribe((action) => {
                expect(powerService.getPowerDataHourly).toHaveBeenCalledWith(pastDate);
                expect(powerService.getPowerDataStats).not.toHaveBeenCalled();
                expect(action.type).toBe(loadHourlyMonitorDataSuccess.type);
                const state = (action as any).data;
                expect(state.data).toEqual(hourlyData);
                expect(state.date).toBe(pastDate);
                expect(state.powerSum).toBe(3);
                expect(state.powerAvg).toBeCloseTo(3 / 24, 5);
                expect(state.forecast).toBeUndefined();
                done();
            });
        });

        it('should dispatch success with forecast for current date', (done) => {
            const hourlyData = [{ hours: 0, power: 5 }];
            // Patch private method for Jest
            Object.defineProperty(effects, 'createHourlyState', {
                value: (date: Date, data: any[]) => ({
                    date,
                    data,
                    powerSum: 5,
                    powerAvg: 5,
                    forecast: undefined,
                    loading: false,
                    error: undefined,
                }),
            });
            powerService.getPowerDataHourly.mockReturnValue(of(hourlyData));
            actions$ = of(loadHourlyMonitorData({ date: mockDate }));
            effects.loadPowerMonitorHourlyData$.subscribe((action) => {
                expect(powerService.getPowerDataHourly).toHaveBeenCalledWith(mockDate);
                expect(powerService.getPowerDataStats).not.toHaveBeenCalled();
                expect(action.type).toBe(loadHourlyMonitorDataSuccess.type);
                const state = (action as any).data;
                expect(state.powerSum).toBe(5);
                expect(state.powerAvg).toBe(5);
                expect(state.forecast).toBe(5 * 24);
                done();
            });
        });

        it('should dispatch failure when hourly data errors for past date', (done) => {
            const err = new Error('hourly fail');
            powerService.getPowerDataHourly.mockReturnValue(throwError(() => err));
            actions$ = of(loadHourlyMonitorData({ date: pastDate }));
            effects.loadPowerMonitorHourlyData$.subscribe((action) => {
                expect(action.type).toBe(loadHourlyMonitorDataFailure.type);
                expect((action as any).error).toBe(err);
                done();
            });
        });

        it('should dispatch failure when hourly data errors for current date', (done) => {
            const err = new Error('hourly fail');
            powerService.getPowerDataHourly.mockReturnValue(throwError(() => err));
            actions$ = of(loadHourlyMonitorData({ date: mockDate }));
            effects.loadPowerMonitorHourlyData$.subscribe((action) => {
                expect(action.type).toBe(loadHourlyMonitorDataFailure.type);
                expect((action as any).error).toBe(err);
                done();
            });
        });
    });

    describe('helper methods', () => {
        const sampleDate = new Date(2025, 4, 27, 12, 0);
        const pastDate = new Date(2025, 4, 26, 0, 0);
        let effectsInstance: any;
        let dummyPowerService: any;
        beforeEach(() => {
            // Provide a dummy PowerService to avoid inject() error
            dummyPowerService = {};
            effectsInstance = Object.create(PowerMonitorHourlyEffects.prototype);
            // Bypass TS private by direct assignment
            Object.defineProperty(effectsInstance, 'powerService', { value: dummyPowerService });
        });

        it('createHourlyState computes powerSum and powerAvg for past date', () => {
            const data = [
                { hours: 0, power: 1.23 },
                { hours: 1, power: 2.34 },
            ];
            const state = (effectsInstance as any).createHourlyState(pastDate, data);
            // powerSum rounded
            expect(state.powerSum).toBeCloseTo(3.57, 2);
            // past date average = powerSum / 24
            expect(state.powerAvg).toBeCloseTo(3.57 / 24, 5);
            expect(state.date).toBe(pastDate);
            expect(state.data).toEqual(data);
        });

        it('getAveragePower returns 0 when data length <= 1', () => {
            const avg = (effectsInstance as any).getAveragePower(sampleDate, 5, [{ power: 5 }]);
            expect(avg).toBe(0);
        });

        it('getAveragePower computes daily average for past date when data length > 1', () => {
            const data = Array(24).fill({});
            const avg = (effectsInstance as any).getAveragePower(pastDate, 24, data as any);
            expect(avg).toBeCloseTo(1, 5);
        });

        it('getAveragePower uses the elapsed part of the day for the current date', () => {
            const today = new Date();
            const partOfDay = today.getHours() + today.getMinutes() / 60;
            const data = Array(24).fill({});
            const avg = (effectsInstance as any).getAveragePower(today, 24, data as any);
            if (partOfDay > 0) {
                expect(avg).toBeCloseTo(24 / partOfDay, 5);
            } else {
                expect(avg).toBe(0);
            }
        });
    });
});
