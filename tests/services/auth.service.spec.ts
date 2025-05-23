import { AuthService } from '../../src/app/services/auth.service';
import { Constants } from '../../src/app/constants';

describe('AuthService', () => {
    let service: AuthService;
    const mockToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        btoa(JSON.stringify({ role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 })) +
        '.signature';
    const mockRefreshToken = 'refresh-token';

    beforeEach(() => {
        localStorage.clear();
        service = new AuthService();
    });

    it('should not be signed in by default', () => {
        expect(service.isSignedIn).toBe(false);
    });

    it('should decode a valid JWT token', () => {
        const decoded = (service as any).decodeToken(mockToken);
        expect(decoded.role).toBe('admin');
    });

    it('should return user role from token', () => {
        localStorage.setItem(Constants.AuthToken, mockToken);
        expect(service.userRole).toBe('admin');
    });

    it('should process login and set tokens', () => {
        service.processLogin({ token: mockToken, refreshToken: mockRefreshToken, expiresIn: 3600 });
        expect(service.isSignedIn).toBe(true);
        expect(service.authToken).toBe(mockToken);
        expect(service.refreshToken).toBe(mockRefreshToken);
        expect(service.userRole).toBe('admin');
    });

    it('should logout and clear tokens', () => {
        service.processLogin({ token: mockToken, refreshToken: mockRefreshToken, expiresIn: 3600 });
        service.logout();
        expect(service.isSignedIn).toBe(false);
        expect(service.authToken).toBeNull();
        expect(service.refreshToken).toBeNull();
        expect(service.userRole).toBeNull();
    });
});
