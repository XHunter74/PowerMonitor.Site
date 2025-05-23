import { RoleGuard } from '../../src/app/guards/role.guard';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../src/app/services/auth.service';

describe('RoleGuard', () => {
    let authService: Partial<AuthService>;
    let guard: RoleGuard;
    let route: ActivatedRouteSnapshot;

    beforeEach(() => {
        authService = {};
        Object.defineProperty(authService, 'userRole', {
            value: 'admin',
            writable: true,
        });
        guard = new RoleGuard(authService as AuthService);
        route = { data: { role: 'admin' } } as unknown as ActivatedRouteSnapshot;
    });

    it('should return true if userRole matches required role (case-insensitive)', () => {
        route.data.role = 'admin';
        Object.defineProperty(authService, 'userRole', { value: 'admin' });
        expect(guard.canActivate(route)).toBe(true);
        Object.defineProperty(authService, 'userRole', { value: 'ADMIN' });
        expect(guard.canActivate(route)).toBe(true);
        // For the last case, use a new mock object to avoid redefining property
        const newAuthService: Partial<AuthService> = {};
        Object.defineProperty(newAuthService, 'userRole', { get: () => 'ADMIN' });
        const newGuard = new RoleGuard(newAuthService as AuthService);
        const newRoute = { data: { role: 'admin' } } as unknown as ActivatedRouteSnapshot;
        expect(newGuard.canActivate(newRoute)).toBe(true);
    });

    it('should return false if userRole does not match required role', () => {
        route.data.role = 'user';
        Object.defineProperty(authService, 'userRole', { value: 'admin' });
        expect(guard.canActivate(route)).toBe(false);
        Object.defineProperty(authService, 'userRole', { value: 'guest' });
        expect(guard.canActivate(route)).toBe(false);
    });

    it('should return false if userRole is null or undefined', () => {
        Object.defineProperty(authService, 'userRole', { value: null });
        expect(guard.canActivate(route)).toBe(false);
        Object.defineProperty(authService, 'userRole', { value: undefined });
        expect(guard.canActivate(route)).toBe(false);
    });
});
