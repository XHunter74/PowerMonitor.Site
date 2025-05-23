import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { PowerFailuresMonthlyEffects } from '../../../src/app/store/effects/power-failures.monthly.effects';
import { AuthService } from '../../../src/app/services/auth.service';

describe('PowerFailuresMonthlyEffects', () => {
    let actions$: Observable<any> = new Observable<any>();
    let effects: PowerFailuresMonthlyEffects;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                PowerFailuresMonthlyEffects,
                provideMockActions(() => actions$),
                AuthService,
            ],
        });
        effects = TestBed.inject(PowerFailuresMonthlyEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });
});
