import { PowerService } from '../src/app/services/power-service';
import { AuthService } from '../src/app/services/auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs';

describe('PowerService', () => {
    let service: PowerService;
    let http: any;
    let authService: any;

    beforeEach(() => {
        http = {
            get: jest.fn(),
            post: jest.fn(),
            put: jest.fn(),
            delete: jest.fn(),
        };
        authService = {};
        service = new PowerService(
            http as unknown as HttpClient,
            authService as AuthService,
            null as any,
        );
    });

    it('should call http.get for getVoltageAmperageData', (done) => {
        http.get.mockReturnValue(of([]));
        service.getVoltageAmperageData(new Date()).subscribe((result) => {
            expect(http.get).toHaveBeenCalledWith(
                expect.stringContaining('power/voltage-amperage'),
                expect.objectContaining({ params: expect.any(Object) }),
            );
            done();
        });
    });

    it('should call http.get for getPowerDataStats', (done) => {
        http.get.mockReturnValue(of([]));
        service.getPowerDataStats().subscribe((result) => {
            expect(http.get).toHaveBeenCalledWith(
                expect.stringContaining('power/power-data-stats'),
                expect.objectContaining({ params: expect.any(Object) }),
            );
            done();
        });
    });

    it('should call http.get for getPowerDataHourly', (done) => {
        http.get.mockReturnValue(of([]));
        service.getPowerDataHourly(new Date()).subscribe((result) => {
            expect(http.get).toHaveBeenCalledWith(
                expect.stringContaining('power/power-data-hourly'),
                expect.objectContaining({ params: expect.any(Object) }),
            );
            done();
        });
    });

    it('should call http.get for getPowerDataDaily', (done) => {
        http.get.mockReturnValue(of([]));
        service.getPowerDataDaily(new Date(), new Date()).subscribe((result) => {
            expect(http.get).toHaveBeenCalledWith(
                expect.stringContaining('power/power-data-daily'),
                expect.objectContaining({ params: expect.any(Object) }),
            );
            done();
        });
    });

    it('should call http.get for getPowerDataMonthly', (done) => {
        http.get.mockReturnValue(of([]));
        service.getPowerDataMonthly(new Date(), new Date()).subscribe((result) => {
            expect(http.get).toHaveBeenCalledWith(
                expect.stringContaining('power/power-data-monthly'),
                expect.objectContaining({ params: expect.any(Object) }),
            );
            done();
        });
    });

    it('should call http.get for getPowerDataYearly', (done) => {
        http.get.mockReturnValue(of([]));
        service.getPowerDataYearly().subscribe((result) => {
            expect(http.get).toHaveBeenCalledWith(
                expect.stringContaining('power/power-data-yearly'),
                expect.objectContaining({ params: expect.any(Object) }),
            );
            done();
        });
    });

    it('should call http.get for getPowerFailuresHourlyData', (done) => {
        http.get.mockReturnValue(of([]));
        service.getPowerFailuresHourlyData(new Date(), new Date()).subscribe((result) => {
            expect(http.get).toHaveBeenCalledWith(
                expect.stringContaining('power/power-availability'),
                expect.objectContaining({ params: expect.any(Object) }),
            );
            done();
        });
    });

    it('should call http.get for getPowerFailuresDailyData', (done) => {
        http.get.mockReturnValue(of([]));
        service.getPowerFailuresDailyData(2025, 5).subscribe((result) => {
            expect(http.get).toHaveBeenCalledWith(
                expect.stringContaining('power/power-availability-daily'),
                expect.objectContaining({ params: expect.any(Object) }),
            );
            done();
        });
    });

    it('should call http.get for getPowerFailuresMonthlyData', (done) => {
        http.get.mockReturnValue(of([]));
        service.getPowerFailuresMonthlyData(2025).subscribe((result) => {
            expect(http.get).toHaveBeenCalledWith(
                expect.stringContaining('power/power-availability-monthly'),
                expect.objectContaining({ params: expect.any(Object) }),
            );
            done();
        });
    });

    it('should call http.get for getPowerFailuresYearlyData', (done) => {
        http.get.mockReturnValue(of([]));
        service.getPowerFailuresYearlyData().subscribe((result) => {
            expect(http.get).toHaveBeenCalledWith(
                expect.stringContaining('power/power-availability-yearly'),
                expect.objectContaining({ params: expect.any(Object) }),
            );
            done();
        });
    });

    it('should call http.get for getPowerConsumptionData', (done) => {
        http.get.mockReturnValue(of([]));
        service.getPowerConsumptionData().subscribe((result) => {
            expect(http.get).toHaveBeenCalledWith(
                expect.stringContaining('power-consumption/energy-data'),
                expect.objectContaining({ params: expect.any(Object) }),
            );
            done();
        });
    });

    it('should call http.delete for deletePowerMeteringRecord', (done) => {
        http.delete.mockReturnValue(of(undefined));
        service.deletePowerMeteringRecord(123).subscribe((result) => {
            expect(http.delete).toHaveBeenCalledWith(
                expect.stringContaining('power-consumption/energy-data/123'),
                expect.any(Object),
            );
            done();
        });
    });

    it('should call http.post for addPowerMeteringRecord', (done) => {
        http.post.mockReturnValue(of({}));
        service.addPowerMeteringRecord({} as any).subscribe((result) => {
            expect(http.post).toHaveBeenCalledWith(
                expect.stringContaining('power-consumption/energy-data'),
                {},
                expect.any(Object),
            );
            done();
        });
    });

    it('should call http.put for editPowerMeteringRecord', (done) => {
        http.put.mockReturnValue(of({}));
        service.editPowerMeteringRecord(123, {} as any).subscribe((result) => {
            expect(http.put).toHaveBeenCalledWith(
                expect.stringContaining('power-consumption/energy-data/123'),
                {},
                expect.any(Object),
            );
            done();
        });
    });
});
