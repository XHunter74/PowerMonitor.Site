import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { PowerMonitorDailyEffects } from '../../../src/app/store/effects/power-monitor.daily.effects';
import { AuthService } from '../../../src/app/services/auth.service';

describe('PowerMonitorDailyEffects', () => {
    let actions$: Observable<any> = new Observable<any>();
    let effects: PowerMonitorDailyEffects;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [PowerMonitorDailyEffects, provideMockActions(() => actions$), AuthService],
        });
        effects = TestBed.inject(PowerMonitorDailyEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });
});
