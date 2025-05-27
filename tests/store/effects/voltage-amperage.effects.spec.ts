import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of, throwError } from 'rxjs';
import { VoltageAmperageEffects } from '../../../src/app/store/effects/voltage-amperage.effects';
import { PowerService } from '../../../src/app/services/power.service';
import {
    loadVoltageAmperage,
    loadVoltageAmperageSuccess,
    loadVoltageAmperageFailure,
} from '../../../src/app/store/actions/voltage-amperage.actions';
import { VoltageAmperageState } from '../../../src/app/store/reducers/voltage-amperage.reducer';
import { IVoltageAmperageModel } from '../../../src/app/models/voltage-amperage.model';

describe('VoltageAmperageEffects', () => {
    let actions$: Observable<any>;
    let effects: VoltageAmperageEffects;
    let powerService: any;

    beforeEach(() => {
        powerService = { getVoltageAmperageData: jest.fn() };
        actions$ = new Observable<any>();
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                VoltageAmperageEffects,
                provideMockActions(() => actions$),
                { provide: PowerService, useValue: powerService },
            ],
        });
        effects = TestBed.inject(VoltageAmperageEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });

    describe('loadVoltageAmperage$', () => {
        const date = new Date(2025, 4, 15);
        beforeEach(() => {
            actions$ = of(loadVoltageAmperage({ date }));
        });

        it('should dispatch success with correct state for multiple entries', (done) => {
            const data: IVoltageAmperageModel[] = [
                {
                    created: new Date(2025, 4, 15, 0),
                    hours: 0,
                    amperageMin: 1,
                    amperageMax: 5,
                    amperageAvg: 3,
                    voltageMin: 210,
                    voltageMax: 230,
                    voltageAvg: 220,
                },
                {
                    created: new Date(2025, 4, 15, 1),
                    hours: 1,
                    amperageMin: 2,
                    amperageMax: 6,
                    amperageAvg: 4,
                    voltageMin: 200,
                    voltageMax: 240,
                    voltageAvg: 220,
                },
            ];
            powerService.getVoltageAmperageData.mockReturnValue(of(data));
            effects.loadVoltageAmperage$.subscribe((action) => {
                expect(powerService.getVoltageAmperageData).toHaveBeenCalledWith(date);
                expect(action.type).toBe(loadVoltageAmperageSuccess.type);
                const state = (action as any).data as VoltageAmperageState;
                expect(state.data).toEqual(data);
                expect(state.date).toEqual(date);
                expect(state.maxVoltage).toEqual(data[1]); // voltageMax 240
                expect(state.minVoltage).toEqual(data[1]); // voltageMin 200
                expect(state.maxAmperage).toEqual(data[1]); // amperageMax 6
                expect(state.minAmperage).toEqual(data[0]); // amperageMin 1
                done();
            });
        });

        it('should dispatch success with correct state for single entry', (done) => {
            const data: IVoltageAmperageModel[] = [
                {
                    created: new Date(2025, 4, 15, 0),
                    hours: 0,
                    amperageMin: 1,
                    amperageMax: 5,
                    amperageAvg: 3,
                    voltageMin: 210,
                    voltageMax: 230,
                    voltageAvg: 220,
                },
            ];
            powerService.getVoltageAmperageData.mockReturnValue(of(data));
            effects.loadVoltageAmperage$.subscribe((action) => {
                expect(action.type).toBe(loadVoltageAmperageSuccess.type);
                const state = (action as any).data as VoltageAmperageState;
                expect(state.maxVoltage).toEqual(data[0]);
                expect(state.minVoltage).toEqual(data[0]);
                expect(state.maxAmperage).toEqual(data[0]);
                expect(state.minAmperage).toEqual(data[0]);
                done();
            });
        });

        it('should dispatch success with nulls for empty data', (done) => {
            const data: IVoltageAmperageModel[] = [];
            powerService.getVoltageAmperageData.mockReturnValue(of(data));
            effects.loadVoltageAmperage$.subscribe((action) => {
                expect(action.type).toBe(loadVoltageAmperageSuccess.type);
                const state = (action as any).data as VoltageAmperageState;
                expect(state.maxVoltage).toBeUndefined();
                expect(state.minVoltage).toBeUndefined();
                expect(state.maxAmperage).toBeUndefined();
                expect(state.minAmperage).toBeUndefined();
                done();
            });
        });

        it('should dispatch failure when service errors', (done) => {
            const err = new Error('voltage error');
            powerService.getVoltageAmperageData.mockReturnValue(throwError(() => err));
            effects.loadVoltageAmperage$.subscribe((action) => {
                expect(action.type).toBe(loadVoltageAmperageFailure.type);
                expect((action as any).error).toBe(err);
                done();
            });
        });

        it('should handle all values equal for max/min', (done) => {
            const data: IVoltageAmperageModel[] = [
                {
                    created: new Date(2025, 4, 15, 0),
                    hours: 0,
                    amperageMin: 2,
                    amperageMax: 2,
                    amperageAvg: 2,
                    voltageMin: 220,
                    voltageMax: 220,
                    voltageAvg: 220,
                },
                {
                    created: new Date(2025, 4, 15, 1),
                    hours: 1,
                    amperageMin: 2,
                    amperageMax: 2,
                    amperageAvg: 2,
                    voltageMin: 220,
                    voltageMax: 220,
                    voltageAvg: 220,
                },
            ];
            powerService.getVoltageAmperageData.mockReturnValue(of(data));
            effects.loadVoltageAmperage$.subscribe((action) => {
                expect(action.type).toBe(loadVoltageAmperageSuccess.type);
                const state = (action as any).data as VoltageAmperageState;
                expect(state.maxVoltage).toEqual(data[0]);
                expect(state.minVoltage).toEqual(data[0]);
                expect(state.maxAmperage).toEqual(data[0]);
                expect(state.minAmperage).toEqual(data[0]);
                done();
            });
        });
    });
});
