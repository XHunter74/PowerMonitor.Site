import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { VoltageAmperageEffects } from '../../../src/app/store/effects/voltage-amperage.effects';
import { AuthService } from '../../../src/app/services/auth.service';

describe('VoltageAmperageEffects', () => {
    let actions$: Observable<any>;
    let effects: VoltageAmperageEffects;

    beforeEach(() => {
        actions$ = new Observable<any>();
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [VoltageAmperageEffects, provideMockActions(() => actions$), AuthService],
        });
        effects = TestBed.inject(VoltageAmperageEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });
});
