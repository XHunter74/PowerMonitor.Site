import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { PowerConsumptionEffects } from '../../../src/app/store/effects/power-consumption.effects';
import { AuthService } from '../../../src/app/services/auth.service';

describe('PowerConsumptionEffects', () => {
    let actions$: Observable<any> = of();
    let effects: PowerConsumptionEffects;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [PowerConsumptionEffects, provideMockActions(() => actions$), AuthService],
        });
        effects = TestBed.inject(PowerConsumptionEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });
});
