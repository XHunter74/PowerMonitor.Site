import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { PowerMonitorYearlyEffects } from '../../../src/app/store/effects/power-monitor.yearly.effects';
import { AuthService } from '../../../src/app/services/auth.service';

describe('PowerMonitorYearlyEffects', () => {
    let actions$: Observable<any> = new Observable<any>();
    let effects: PowerMonitorYearlyEffects;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [PowerMonitorYearlyEffects, provideMockActions(() => actions$), AuthService],
        });
        effects = TestBed.inject(PowerMonitorYearlyEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });
});
