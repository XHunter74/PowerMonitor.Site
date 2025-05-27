import { PowerService } from '..//../src/app/services/power.service';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { PowerFailureDailyModel } from '../../src/app/models/power-failure-daily.model';
import { PowerFailureMonthlyModel } from '../../src/app/models/power-failure-monthly.model';
import { NewPowerMeteringDto } from '../../src/app/models/new-power-metering.dto';

jest.mock('../../src/app/services/http.service');

describe('PowerService', () => {
    let service: PowerService;
    let http: any;
    let authService: any;
    beforeEach(() => {
        http = { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() };
        authService = {};
        service = new PowerService(http, authService, null);
        jest.spyOn(service, 'get').mockImplementation((...args) => of([]));
        jest.spyOn(service, 'post').mockImplementation((...args) => of({}));
        jest.spyOn(service, 'put').mockImplementation((...args) => of({}));
        jest.spyOn(service, 'delete').mockImplementation((...args) => of(undefined));
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('should call getVoltageAmperageData with correct params', (done) => {
        const date = new Date(2025, 4, 1);
        service.getVoltageAmperageData(date).subscribe(() => {
            expect(service.get).toHaveBeenCalledWith(
                'power/voltage-amperage',
                expect.any(HttpParams),
            );
            done();
        });
    });

    it('should call getPowerDataStats with correct params', (done) => {
        service.getPowerDataStats().subscribe(() => {
            expect(service.get).toHaveBeenCalledWith(
                'power/power-data-stats',
                expect.any(HttpParams),
            );
            done();
        });
    });

    it('should call getPowerDataHourly with correct params', (done) => {
        const date = new Date(2025, 4, 1);
        service.getPowerDataHourly(date).subscribe(() => {
            expect(service.get).toHaveBeenCalledWith(
                'power/power-data-hourly',
                expect.any(HttpParams),
            );
            done();
        });
    });

    it('should call getPowerDataDaily with correct params', (done) => {
        const start = new Date(2025, 4, 1);
        const finish = new Date(2025, 4, 2);
        service.getPowerDataDaily(start, finish).subscribe(() => {
            expect(service.get).toHaveBeenCalledWith(
                'power/power-data-daily',
                expect.any(HttpParams),
            );
            done();
        });
    });

    it('should call getPowerDataMonthly with correct params', (done) => {
        const start = new Date(2025, 4, 1);
        const finish = new Date(2025, 4, 2);
        service.getPowerDataMonthly(start, finish).subscribe(() => {
            expect(service.get).toHaveBeenCalledWith(
                'power/power-data-monthly',
                expect.any(HttpParams),
            );
            done();
        });
    });

    it('should call getPowerDataYearly with correct params', (done) => {
        service.getPowerDataYearly().subscribe(() => {
            expect(service.get).toHaveBeenCalledWith(
                'power/power-data-yearly',
                expect.any(HttpParams),
            );
            done();
        });
    });

    it('should call getPowerFailuresHourlyData with correct params', (done) => {
        const start = new Date(2025, 4, 1);
        const finish = new Date(2025, 4, 2);
        service.getPowerFailuresHourlyData(start, finish).subscribe(() => {
            expect(service.get).toHaveBeenCalledWith(
                'power/power-availability',
                expect.any(HttpParams),
            );
            done();
        });
    });

    it('should map getPowerFailuresDailyData to PowerFailureDailyModel', (done) => {
        const data = [{ year: 2025, month: 5, day: 1, duration: 10, events: 2 }];
        (service.get as jest.Mock).mockReturnValueOnce(of(data));
        service.getPowerFailuresDailyData(2025, 5).subscribe((result) => {
            expect(result[0]).toBeInstanceOf(PowerFailureDailyModel);
            expect(result[0].year).toBe(2025);
            expect(result[0].month).toBe(5);
            expect(result[0].day).toBe(1);
            expect(result[0].duration).toBe(10);
            expect(result[0].events).toBe(2);
            expect(result[0].eventDate).toBeInstanceOf(Date);
            done();
        });
    });

    it('should map getPowerFailuresMonthlyData to PowerFailureMonthlyModel', (done) => {
        const data = [{ year: 2025, month: 5, duration: 10, events: 2 }];
        (service.get as jest.Mock).mockReturnValueOnce(of(data));
        service.getPowerFailuresMonthlyData(2025).subscribe((result) => {
            expect(result[0]).toBeInstanceOf(PowerFailureMonthlyModel);
            expect(result[0].year).toBe(2025);
            expect(result[0].month).toBe(5);
            expect(result[0].duration).toBe(10);
            expect(result[0].events).toBe(2);
            expect(result[0].eventDate).toBeInstanceOf(Date);
            done();
        });
    });

    it('should map getPowerFailuresYearlyData to PowerFailureMonthlyModel', (done) => {
        const data = [{ year: 2025, duration: 10, events: 2 }];
        (service.get as jest.Mock).mockReturnValueOnce(of(data));
        service.getPowerFailuresYearlyData().subscribe((result) => {
            expect(result[0]).toBeInstanceOf(PowerFailureMonthlyModel);
            expect(result[0].year).toBe(2025);
            expect(result[0].duration).toBe(10);
            expect(result[0].events).toBe(2);
            expect(result[0].eventDate).toBeInstanceOf(Date);
            done();
        });
    });

    it('should map getPowerConsumptionData to PowerMeteringDto and parse eventDate', (done) => {
        const data = [{ eventDate: '2025-05-01T00:00:00.000Z' }];
        (service.get as jest.Mock).mockReturnValueOnce(of(data));
        service.getPowerConsumptionData().subscribe((result) => {
            expect(result[0]).toHaveProperty('eventDate');
            expect(result[0].eventDate).toBeInstanceOf(Date);
            done();
        });
    });

    it('should return empty array if getPowerConsumptionData result is falsy', (done) => {
        (service.get as jest.Mock).mockReturnValueOnce(of(undefined));
        service.getPowerConsumptionData().subscribe((result) => {
            expect(result).toEqual([]);
            done();
        });
    });

    it('should call deletePowerMeteringRecord with correct url', (done) => {
        service.deletePowerMeteringRecord(123).subscribe(() => {
            expect(service.delete).toHaveBeenCalledWith('power-consumption/energy-data/123');
            done();
        });
    });

    it('should call addPowerMeteringRecord with correct url and data', (done) => {
        const newRecord = { eventDate: new Date(), value: 10 } as NewPowerMeteringDto;
        service.addPowerMeteringRecord(newRecord).subscribe(() => {
            expect(service.post).toHaveBeenCalledWith('power-consumption/energy-data', newRecord);
            done();
        });
    });

    it('should call editPowerMeteringRecord with correct url and data', (done) => {
        const newRecord = { eventDate: new Date(), value: 10 } as NewPowerMeteringDto;
        service.editPowerMeteringRecord(123, newRecord).subscribe(() => {
            expect(service.put).toHaveBeenCalledWith(
                'power-consumption/energy-data/123',
                newRecord,
            );
            done();
        });
    });
});
