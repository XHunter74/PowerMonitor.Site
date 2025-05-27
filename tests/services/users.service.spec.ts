import { UsersService } from '../../src/app/services/users.service';
import { AuthService } from '../../src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('UsersService', () => {
    let service: UsersService;
    let http: any;
    let authService: any;

    beforeEach(() => {
        http = {
            post: jest.fn(),
        };
        authService = { processLogin: jest.fn() };
        service = new UsersService(
            http as unknown as HttpClient,
            null as any,
            authService as AuthService,
        );
    });

    it('should call http.post and processLogin on login', (done) => {
        const userToken = { token: 'abc', refreshToken: 'def' };
        http.post.mockReturnValue(of(userToken));
        service.login('user', 'pass').subscribe((result) => {
            expect(http.post).toHaveBeenCalledWith(
                expect.stringContaining('auth/login'),
                { username: 'user', password: 'pass' },
                expect.objectContaining({ headers: expect.any(Object), params: null }),
            );
            expect(authService.processLogin).toHaveBeenCalledWith(userToken);
            expect(result).toBe(userToken);
            done();
        });
    });

    it('should call http.post for changePassword', (done) => {
        const userToken = { token: 'abc', refreshToken: 'def' };
        http.post.mockReturnValue(of(userToken));
        service.changePassword('newpass').subscribe((result) => {
            expect(http.post).toHaveBeenCalledWith(
                expect.stringContaining('auth/change-password'),
                { newPassword: 'newpass' },
                expect.any(Object),
            );
            expect(result).toBe(userToken);
            done();
        });
    });

    it('should call http.post for refreshToken', (done) => {
        const userToken = { token: 'abc', refreshToken: 'def' };
        http.post.mockReturnValue(of(userToken));
        service.refreshToken('sometoken').subscribe((result) => {
            expect(http.post).toHaveBeenCalledWith(
                expect.stringContaining('auth/refresh-token?token=sometoken'),
                null,
                expect.any(Object),
            );
            expect(result).toBe(userToken);
            done();
        });
    });
});
