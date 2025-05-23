import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { PowerMonitorHourlyEffects } from '../../../src/app/store/effects/power-monitor.hourly.effects';
import { AuthService } from '../../../src/app/services/auth.service';

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
});
