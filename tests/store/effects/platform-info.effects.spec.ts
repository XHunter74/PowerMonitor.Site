import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { PlatformInfoEffects } from '../../../src/app/store/effects/platform-info.effects';
import { InfoService } from '../../../src/app/services/info.service';
import { AuthService } from '../../../src/app/services/auth.service';

describe('PlatformInfoEffects', () => {
    let actions$: Observable<any> = new Observable<any>();
    let effects: PlatformInfoEffects;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                PlatformInfoEffects,
                provideMockActions(() => actions$),
                InfoService,
                AuthService,
            ],
        });
        effects = TestBed.inject(PlatformInfoEffects);
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });
});
