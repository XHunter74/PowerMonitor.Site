import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of, throwError } from 'rxjs';
import { PowerConsumptionEffects } from '../../../src/app/store/effects/power-consumption.effects';
import { PowerService } from '../../../src/app/services/power.service';
import {
    loadPowerConsumptionData,
    loadPowerConsumptionDataSuccess,
    loadPowerConsumptionDataFailure,
} from '../../../src/app/store/actions/power-consumption.actions';
import { PowerConsumptionState } from '../../../src/app/store/reducers/power-consumption.reducer';
import { PowerMeteringDto } from '../../../src/app/models/power-metering.dto';

describe('PowerConsumptionEffects', () => {
    let actions$: Observable<any>;
    let effects: PowerConsumptionEffects;
    let powerService: any;

    beforeEach(() => {
        powerService = { getPowerConsumptionData: jest.fn() };
        actions$ = of();
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                PowerConsumptionEffects,
                provideMockActions(() => actions$),
                { provide: PowerService, useValue: powerService },
            ],
        });
        effects = TestBed.inject(PowerConsumptionEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });

    describe('loadPowerConsumptionData$', () => {
        beforeEach(() => {
            actions$ = of(loadPowerConsumptionData({ data: undefined }));
        });

        it('should dispatch success with correct state for multiple entries', (done) => {
            const data: PowerMeteringDto[] = [
                {
                    id: 2,
                    eventDate: new Date(2025, 4, 1),
                    factualData: 10,
                    monitorData: 20,
                    difference: 10,
                    hours: 1,
                    coefficient: 1,
                },
                {
                    id: 1,
                    eventDate: new Date(2025, 4, 2),
                    factualData: 20,
                    monitorData: 30,
                    difference: 10,
                    hours: 2,
                    coefficient: 1,
                },
            ];
            powerService.getPowerConsumptionData.mockReturnValue(of(data));
            effects.loadPowerConsumptionData$.subscribe((action) => {
                expect(powerService.getPowerConsumptionData).toHaveBeenCalled();
                expect(action.type).toBe(loadPowerConsumptionDataSuccess.type);
                const state = (action as any).data as PowerConsumptionState;
                expect(state.data).toEqual(data);
                expect(state.minItem).toEqual(data[1]); // id: 1 is min
                done();
            });
        });

        it('should dispatch success with correct state for single entry', (done) => {
            const data: PowerMeteringDto[] = [
                {
                    id: 5,
                    eventDate: new Date(2025, 4, 1),
                    factualData: 10,
                    monitorData: 20,
                    difference: 10,
                    hours: 1,
                    coefficient: 1,
                },
            ];
            powerService.getPowerConsumptionData.mockReturnValue(of(data));
            effects.loadPowerConsumptionData$.subscribe((action) => {
                expect(action.type).toBe(loadPowerConsumptionDataSuccess.type);
                const state = (action as any).data as PowerConsumptionState;
                expect(state.data).toEqual(data);
                expect(state.minItem).toEqual(data[0]);
                done();
            });
        });

        it('should dispatch success with undefined minItem for empty data', (done) => {
            const data: PowerMeteringDto[] = [];
            powerService.getPowerConsumptionData.mockReturnValue(of(data));
            // Suppress console.error for this test
            const originalError = console.error;
            console.error = jest.fn();
            let subscription;
            subscription = effects.loadPowerConsumptionData$.subscribe({
                next: (action) => {
                    try {
                        expect(action.type).toBe(loadPowerConsumptionDataSuccess.type);
                        const state = (action as any).data as PowerConsumptionState;
                        expect(state.data).toEqual([]);
                        expect(state.minItem).toBeUndefined();
                        done();
                    } finally {
                        console.error = originalError;
                        if (subscription) subscription.unsubscribe();
                    }
                },
                error: (err) => {
                    console.error = originalError;
                    if (subscription) subscription.unsubscribe();
                    done.fail('Should not error: ' + err);
                },
            });
        });

        it('should dispatch failure when service errors', (done) => {
            const err = new Error('consumption error');
            powerService.getPowerConsumptionData.mockReturnValue(throwError(() => err));
            effects.loadPowerConsumptionData$.subscribe((action) => {
                expect(action.type).toBe(loadPowerConsumptionDataFailure.type);
                expect((action as any).error).toBe(err);
                done();
            });
        });
    });
});
