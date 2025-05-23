import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { PowerConsumptionEditEffects } from '../../../src/app/store/effects/power-consumption.edit.effects';
import { AuthService } from '../../../src/app/services/auth.service';

describe('PowerConsumptionEditEffects', () => {
    let actions$: Observable<any> = new Observable<any>();
    let effects: PowerConsumptionEditEffects;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                PowerConsumptionEditEffects,
                provideMockActions(() => actions$),
                AuthService,
            ],
        });
        effects = TestBed.inject(PowerConsumptionEditEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });
});
