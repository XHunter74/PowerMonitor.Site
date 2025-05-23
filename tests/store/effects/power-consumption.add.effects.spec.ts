import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { PowerConsumptionAddEffects } from '../../../src/app/store/effects/power-consumption.add.effects';
import { AuthService } from '../../../src/app/services/auth.service';

describe('PowerConsumptionAddEffects', () => {
    let actions$: Observable<any>;
    let effects: PowerConsumptionAddEffects;

    beforeEach(() => {
        actions$ = new Observable<any>();
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                PowerConsumptionAddEffects,
                provideMockActions(() => actions$),
                AuthService,
            ],
        });
        effects = TestBed.inject(PowerConsumptionAddEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });
});
