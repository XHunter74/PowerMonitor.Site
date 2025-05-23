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
});
