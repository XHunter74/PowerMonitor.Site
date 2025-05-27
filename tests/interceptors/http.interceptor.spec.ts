// Suppress console.error for this test suite
beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
});
import { BehaviorSubject, Subject } from 'rxjs';
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

    // Suppress unhandled rejections during refreshTokenSilently tests
    beforeAll(() => {
        // @ts-ignore: suppress unhandledRejection handler on process
        process.on('unhandledRejection', () => {});
    });
    afterAll(() => {
        // @ts-ignore: suppress unhandledRejection handler removal
        process.removeAllListeners('unhandledRejection');
    });
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

    it('should queue requests behind an ongoing token refresh', (done) => {
        // Simulate a refresh in progress
        (interceptor as any).isRefreshingToken = true;
        const tokenSubject = new BehaviorSubject<string | null>(null);
        (interceptor as any).tokenRefreshSubject = tokenSubject;
        const req = new HttpRequest('GET', '/api/test');
        let retried = false;
        (next.handle as jest.Mock).mockImplementation((request) => {
            if (request.headers.get('Authorization') === 'Bearer queuedToken') {
                retried = true;
            }
            return of({} as HttpEvent<any>);
        });
        interceptor['queueRequestBehindRefresh'](req, next as HttpHandler).subscribe(() => {
            expect(retried).toBe(true);
            done();
        });
        // Simulate token being emitted after refresh
        tokenSubject.next('queuedToken');
    });

    it('should not trigger silent refresh if not signed in', () => {
        Object.defineProperty(authService, 'isSignedIn', { get: () => false });
        const spy = jest.spyOn(usersService, 'refreshToken');
        (interceptor as any).setupTokenRefreshTimer();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should not trigger silent refresh if token expiry is negative', () => {
        Object.defineProperty(authService, 'isSignedIn', { get: () => true });
        Object.defineProperty(authService, 'tokenExpiresIn', { get: () => Date.now() - 10000 });
        const spy = jest.spyOn(usersService, 'refreshToken');
        (interceptor as any).setupTokenRefreshTimer();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should not trigger silent refresh if no refreshToken', () => {
        Object.defineProperty(authService, 'isSignedIn', { get: () => true });
        Object.defineProperty(authService, 'tokenExpiresIn', { get: () => Date.now() + 1000 });
        authService.refreshToken = null;
        const spy = jest.spyOn(usersService, 'refreshToken');
        (interceptor as any).setupTokenRefreshTimer();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should perform silent refresh if token is about to expire', (done) => {
        Object.defineProperty(authService, 'isSignedIn', { get: () => true });
        Object.defineProperty(authService, 'tokenExpiresIn', { get: () => Date.now() + 1000 });
        authService.refreshToken = 'refresh';
        delete usersService.refreshToken;
        usersService.refreshToken = jest
            .fn()
            .mockReturnValue(of({ token: 'silent', refreshToken: 'refresh' } as UserTokenDto));
        const processLoginSpy = jest.spyOn(authService, 'processLogin');
        try {
            (interceptor as any).refreshTokenSilently('refresh');
            setTimeout(() => {
                try {
                    expect(usersService.refreshToken).toHaveBeenCalledWith('refresh');
                    expect(processLoginSpy).toHaveBeenCalled();
                    done();
                } catch (err) {
                    done(err);
                }
            }, 10);
        } catch (err) {
            done(err);
        }
    });

    it('should handle silent refresh error gracefully', (done) => {
        Object.defineProperty(authService, 'isSignedIn', { get: () => true });
        Object.defineProperty(authService, 'tokenExpiresIn', { get: () => Date.now() + 1000 });
        authService.refreshToken = 'refresh';
        delete usersService.refreshToken;
        usersService.refreshToken = jest.fn().mockReturnValue(throwError(() => new Error('fail')));
        const processLoginSpy = jest.spyOn(authService, 'processLogin');
        try {
            (interceptor as any).refreshTokenSilently('refresh');
            setTimeout(() => {
                try {
                    expect(usersService.refreshToken).toHaveBeenCalledWith('refresh');
                    expect(processLoginSpy).not.toHaveBeenCalled();
                    done();
                } catch (err) {
                    done(err);
                }
            }, 10);
        } catch (err) {
            done(err);
        }
    });

    it('should only take the first non-null token in queueRequestBehindRefresh', (done) => {
        const tokenSubject = new Subject<string | null>();
        (interceptor as any).tokenRefreshSubject = tokenSubject;
        const req = new HttpRequest('GET', '/api/test');
        let callCount = 0;
        (next.handle as jest.Mock).mockImplementation((request) => {
            callCount++;
            return of({} as HttpEvent<any>);
        });
        interceptor['queueRequestBehindRefresh'](req, next as HttpHandler).subscribe(() => {
            expect(callCount).toBe(1);
            done();
        });
        tokenSubject.next(null);
        tokenSubject.next('token1');
        tokenSubject.next('token2');
    });
});
