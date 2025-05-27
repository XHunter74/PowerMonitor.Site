import { HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { HttpService } from '../../src/app/services/http.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../src/app/services/auth.service';
import { of, throwError } from 'rxjs';

const mockHttpClient = () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
});

describe('HttpService', () => {
    let http: any;
    let authService: any;
    let service: HttpService;

    beforeEach(() => {
        http = mockHttpClient();
        http.get.mockReturnValue(of('data'));
        http.post.mockReturnValue(of('data'));
        http.put.mockReturnValue(of('data'));
        http.delete.mockReturnValue(of('data'));
        authService = { logout: jest.fn() };
        service = new HttpService(
            http as unknown as HttpClient,
            null as any,
            authService as AuthService,
        );
    });

    it('should call http.get in get()', () => {
        http.get.mockReturnValue(of('data'));
        service.get('test-url').subscribe((result) => {
            expect(result).toBe('data');
        });
        expect(http.get).toHaveBeenCalled();
    });

    it('should call http.post in post()', () => {
        http.post.mockReturnValue(of('data'));
        service.post('test-url', { foo: 'bar' }).subscribe((result) => {
            expect(result).toBe('data');
        });
        expect(http.post).toHaveBeenCalled();
    });

    it('should call http.put in put()', () => {
        http.put.mockReturnValue(of('data'));
        service.put('test-url', { foo: 'bar' }).subscribe((result) => {
            expect(result).toBe('data');
        });
        expect(http.put).toHaveBeenCalled();
    });

    it('should call http.delete in delete()', () => {
        http.delete.mockReturnValue(of('data'));
        service.delete('test-url').subscribe((result) => {
            expect(result).toBe('data');
        });
        expect(http.delete).toHaveBeenCalled();
    });

    it('should handle error and call logout on 401 (not login)', () => {
        const error = { status: 401, url: 'api/other', error: {} };
        http.get.mockReturnValue(throwError(() => error));
        service.get('other').subscribe({
            error: () => {
                expect(authService.logout).toHaveBeenCalled();
            },
        });
    });

    it('should not call logout on 401 for login', () => {
        const error = { status: 401, url: 'api/auth/login', error: {} };
        http.get.mockReturnValue(throwError(() => error));
        service.get('auth/login').subscribe({
            error: () => {
                expect(authService.logout).not.toHaveBeenCalled();
            },
        });
    });

    it('should throw if parentModule is provided', () => {
        // Use a minimal mock with the required properties for type compatibility
        const parentModuleMock = {
            baseUrl: '',
            http: {},
            authService: {},
            get: () => {},
            getExt: () => {},
            post: () => {},
            put: () => {},
            delete: () => {},
            handleError: () => {},
        };
        expect(() => new HttpService(http, parentModuleMock as any, authService)).toThrow();
    });

    it('should call http.get with headers in getExt', () => {
        const params = new HttpParams();
        const headers = [{ name: 'X-Test', value: 'abc' }];
        const spy = jest.spyOn(HttpHeaders.prototype, 'append');
        service.getExt('url', headers, params, false).subscribe();
        expect(spy).toHaveBeenCalledWith('X-Test', 'abc');
        spy.mockRestore();
    });

    it('should set Content-Type to application/json in post if not FormData', () => {
        const params = new HttpParams();
        service.post('url', { foo: 'bar' }, params, false).subscribe();
        const call = http.post.mock.calls[0][2];
        expect(call.headers.get('Content-Type')).toBe('application/json');
    });

    it('should not set Content-Type in post if body is FormData', () => {
        const params = new HttpParams();
        const formData = new FormData();
        service.post('url', formData, params, false).subscribe();
        const call = http.post.mock.calls[0][2];
        expect(call.headers.get('Content-Type')).toBeNull();
    });

    it('should call http.put with correct params in put', () => {
        const params = new HttpParams();
        service.put('url', { foo: 'bar' }, params, false).subscribe();
        expect(http.put).toHaveBeenCalledWith(
            expect.stringContaining('url'),
            { foo: 'bar' },
            expect.objectContaining({ params }),
        );
    });

    it('should call http.delete with correct params in delete', () => {
        const params = new HttpParams();
        service.delete('url', undefined, params, false).subscribe();
        expect(http.delete).toHaveBeenCalledWith(
            expect.stringContaining('url'),
            expect.objectContaining({ params }),
        );
    });

    it('should log error for ErrorEvent', () => {
        const error = { error: new ErrorEvent('test', { message: 'err' }), status: 0 } as any;
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        service.handleError(authService, error);
        expect(spy).toHaveBeenCalledWith('An error occurred:', 'err');
        spy.mockRestore();
    });

    it('should log backend error for other errors', () => {
        const error = { status: 500, error: { foo: 'bar' } } as HttpErrorResponse;
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        service.handleError(authService, error);
        const calls = spy.mock.calls;
        expect(calls[calls.length - 1][0]).toEqual(
            expect.stringContaining('Backend returned code 500'),
        );
        // Accept undefined or any value for the second argument
        // (console.error may be called with one or two arguments)
        spy.mockRestore();
    });
});
