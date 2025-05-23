import { AuthGuard, OpenGuard } from '../../src/app/guards/auth.guard';
import { AuthService } from '../../src/app/services/auth.service';
import { Router, RouterStateSnapshot } from '@angular/router';

describe('AuthGuard', () => {
    let authService: Partial<AuthService>;
    let router: Partial<Router>;
    let guard: AuthGuard;
    let state: RouterStateSnapshot;

    beforeEach(() => {
        authService = {};
        Object.defineProperty(authService, 'isSignedIn', {
            value: false,
            writable: true,
        });
        router = { navigate: jest.fn() } as Partial<Router>;
        guard = new AuthGuard(authService as AuthService, router as Router);
        state = { url: '/test' } as RouterStateSnapshot;
        jest.spyOn(localStorage.__proto__, 'setItem');
    });

    afterEach(() => {
        (localStorage.setItem as jest.Mock).mockRestore();
    });

    it('should redirect to login and return false when not signed in', () => {
        Object.defineProperty(authService, 'isSignedIn', { value: false });
        const result = guard.canActivate(state);
        expect(router.navigate).toHaveBeenCalledWith(['/app-login'], {
            queryParams: { returnUrl: state.url },
        });
        expect(result).toBe(false);
    });

    it('should store last_url and return true when signed in', () => {
        Object.defineProperty(authService, 'isSignedIn', { value: true });
        const result = guard.canActivate(state);
        expect(localStorage.setItem).toHaveBeenCalledWith('last_url', state.url);
        expect(result).toBe(true);
    });
});

describe('OpenGuard', () => {
    let guard: OpenGuard;
    let state: RouterStateSnapshot;

    beforeEach(() => {
        guard = new OpenGuard();
        state = { url: '/open' } as RouterStateSnapshot;
        jest.spyOn(localStorage.__proto__, 'setItem');
    });

    afterEach(() => {
        (localStorage.setItem as jest.Mock).mockRestore();
    });

    it('should always set last_url and return true', () => {
        const result = guard.canActivate(state);
        expect(localStorage.setItem).toHaveBeenCalledWith('last_url', state.url);
        expect(result).toBe(true);
    });
});
