import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { PowerFailuresDailyEffects } from '../../../src/app/store/effects/power-failures.daily.effects';
import { AuthService } from '../../../src/app/services/auth.service';

describe('PowerFailuresDailyEffects', () => {
    let actions$: Observable<any> = new Observable<any>();
    let effects: PowerFailuresDailyEffects;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [PowerFailuresDailyEffects, provideMockActions(() => actions$), AuthService],
        });
        effects = TestBed.inject(PowerFailuresDailyEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });
});
