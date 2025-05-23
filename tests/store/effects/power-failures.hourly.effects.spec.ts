import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { PowerFailuresHourlyEffects } from '../../../src/app/store/effects/power-failures.hourly.effects';
import { AuthService } from '../../../src/app/services/auth.service';

describe('PowerFailuresHourlyEffects', () => {
    let actions$: Observable<any> = new Observable<any>();
    let effects: PowerFailuresHourlyEffects;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                PowerFailuresHourlyEffects,
                provideMockActions(() => actions$),
                AuthService,
            ],
        });
        effects = TestBed.inject(PowerFailuresHourlyEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });
});
