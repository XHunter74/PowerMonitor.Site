import { AppHttpInterceptor } from '../../src/app/interceptors/http.interceptor';
import { AuthService } from '../../src/app/services/auth.service';
import { UsersService } from '../../src/app/services/users.service';
import { UserTokenDto } from '../../src/app/models/user-token.dto';
import { HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('AppHttpInterceptor', () => {
    let interceptor: AppHttpInterceptor;
    let authService: Partial<AuthService>;
    let usersService: Partial<UsersService>;
    let next: Partial<HttpHandler>;

    beforeEach(() => {
        authService = {
            isSignedIn: true,
            authToken: 'token',
            refreshToken: 'refresh',
            tokenExpiresIn: Date.now() + 60000,
            processLogin: jest.fn(),
            logout: jest.fn(),
        };
        usersService = {
            refreshToken: jest
                .fn()
                .mockReturnValue(
                    of({ token: 'newToken', refreshToken: 'refresh' } as UserTokenDto),
                ),
        };
        next = {
            handle: jest.fn().mockReturnValue(of({} as HttpEvent<any>)),
        };
        interceptor = new AppHttpInterceptor(
            authService as AuthService,
            usersService as UsersService,
        );
    });

    it('should add Authorization header if authToken exists', (done) => {
        const req = new HttpRequest('GET', '/api/test');
        (next.handle as jest.Mock).mockImplementation((request) => {
            expect(request.headers.get('Authorization')).toBe('Bearer token');
            return of({} as HttpEvent<any>);
        });
        interceptor.intercept(req, next as HttpHandler).subscribe(() => done());
    });

    it('should skip adding token for refresh token requests', (done) => {
        const req = new HttpRequest('GET', '/api/auth/refresh-token');
        (next.handle as jest.Mock).mockImplementation((request) => {
            expect(request.headers.has('Authorization')).toBe(false);
            return of({} as HttpEvent<any>);
        });
        interceptor.intercept(req, next as HttpHandler).subscribe(() => done());
    });

    it('should call handle401Error on 401 error', (done) => {
        const req = new HttpRequest('GET', '/api/test');
        (next.handle as jest.Mock).mockReturnValueOnce(
            throwError(() => new HttpErrorResponse({ status: 401 })),
        );
        jest.spyOn(interceptor as any, 'handle401Error').mockReturnValue(of({} as HttpEvent<any>));
        interceptor.intercept(req, next as HttpHandler).subscribe(() => {
            expect((interceptor as any).handle401Error).toHaveBeenCalled();
            done();
        });
    });

    it('should logout and throw error if no refresh token on 401', (done) => {
        authService.refreshToken = null;
        const req = new HttpRequest('GET', '/api/test');
        (next.handle as jest.Mock).mockReturnValueOnce(
            throwError(() => new HttpErrorResponse({ status: 401 })),
        );
        interceptor = new AppHttpInterceptor(
            authService as AuthService,
            usersService as UsersService,
        );
        interceptor.intercept(req, next as HttpHandler).subscribe({
            error: (err) => {
                expect(authService.logout).toHaveBeenCalled();
                expect(err.message).toBe('Authentication required');
                done();
            },
        });
    });

    it('should refresh token and retry request on 401', (done) => {
        const req = new HttpRequest('GET', '/api/test');
        (next.handle as jest.Mock)
            .mockReturnValueOnce(throwError(() => new HttpErrorResponse({ status: 401 })))
            .mockReturnValueOnce(of({} as HttpEvent<any>));
        usersService.refreshToken = jest
            .fn()
            .mockReturnValue(of({ token: 'newToken', refreshToken: 'refresh' } as UserTokenDto));
        interceptor = new AppHttpInterceptor(
            authService as AuthService,
            usersService as UsersService,
        );
        interceptor.intercept(req, next as HttpHandler).subscribe(() => {
            expect(usersService.refreshToken).toHaveBeenCalledWith('refresh');
            expect(authService.processLogin).toHaveBeenCalled();
            done();
        });
    });

    it('should handle failed token refresh and logout', (done) => {
        usersService.refreshToken = jest.fn().mockReturnValue(throwError(() => new Error('fail')));
        const req = new HttpRequest('GET', '/api/test');
        (next.handle as jest.Mock).mockReturnValueOnce(
            throwError(() => new HttpErrorResponse({ status: 401 })),
        );
        interceptor = new AppHttpInterceptor(
            authService as AuthService,
            usersService as UsersService,
        );
        interceptor.intercept(req, next as HttpHandler).subscribe({
            error: (err) => {
                expect(authService.logout).toHaveBeenCalled();
                expect(err.message).toBe('Token refresh failed');
                done();
            },
        });
    });
});
