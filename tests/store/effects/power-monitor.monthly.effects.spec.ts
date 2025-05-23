import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { PowerMonitorMonthlyEffects } from '../../../src/app/store/effects/power-monitor.monthly.effects';
import { AuthService } from '../../../src/app/services/auth.service';

describe('PowerMonitorMonthlyEffects', () => {
    let actions$: Observable<any> = new Observable<any>();
    let effects: PowerMonitorMonthlyEffects;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                PowerMonitorMonthlyEffects,
                provideMockActions(() => actions$),
                AuthService,
            ],
        });
        effects = TestBed.inject(PowerMonitorMonthlyEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });
});
