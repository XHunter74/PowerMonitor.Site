import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { PowerConsumptionDeleteEffects } from '../../../src/app/store/effects/power-consumption.delete.effects';
import { AuthService } from '../../../src/app/services/auth.service';

describe('PowerConsumptionDeleteEffects', () => {
    let actions$: Observable<any> = new Observable<any>();
    let effects: PowerConsumptionDeleteEffects;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                PowerConsumptionDeleteEffects,
                provideMockActions(() => actions$),
                AuthService,
            ],
        });
        effects = TestBed.inject(PowerConsumptionDeleteEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });
});
