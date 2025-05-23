import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { PowerFailuresYearlyEffects } from '../../../src/app/store/effects/power-failures.yearly.effects';
import { AuthService } from '../../../src/app/services/auth.service';

describe('PowerFailuresYearlyEffects', () => {
    let actions$: Observable<any>;
    let effects: PowerFailuresYearlyEffects;

    beforeEach(() => {
        actions$ = new Observable<any>();
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                PowerFailuresYearlyEffects,
                provideMockActions(() => actions$),
                AuthService,
            ],
        });
        effects = TestBed.inject(PowerFailuresYearlyEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });
});
