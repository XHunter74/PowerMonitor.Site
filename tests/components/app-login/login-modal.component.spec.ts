import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginModalComponent } from '../../../src/app/components/app-login/login-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateService, TranslateModule, TranslateStore } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../src/app/services/users.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { ErrorDialogComponent } from '../../../src/app/dialogs/error-dialog/error-dialog.component';

// Mock ErrorDialogComponent before any imports so tests use the mock
jest.mock('../../../src/app/dialogs/error-dialog/error-dialog.component', () => ({
    ErrorDialogComponent: { show: jest.fn() },
}));
// Grab the mock instance
const MockErrorDialogComponent = jest.requireMock(
    '../../../src/app/dialogs/error-dialog/error-dialog.component',
).ErrorDialogComponent;

// Mocks
class MockDialogRef {
    close = jest.fn();
}
class MockUsersService {
    login = jest.fn(() => of({}));
}
class MockActivatedRoute {
    snapshot = { queryParams: {} };
}
class MockRouter {
    url = '/';
    navigate = jest.fn();
    navigateByUrl = jest.fn();
}
class MockDialog {}
class MockTranslateService {
    get = jest.fn(() => of('error'));
}

describe('LoginModalComponent', () => {
    let component: LoginModalComponent;
    let fixture: ComponentFixture<LoginModalComponent>;
    let usersService: any;
    let dialogRef: MockDialogRef;
    let router: MockRouter;
    let translate: any;

    beforeEach(async () => {
        // Reset the ErrorDialogComponent.show mock before each test
        (ErrorDialogComponent.show as jest.Mock).mockClear();
        await TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [LoginModalComponent],
            providers: [
                { provide: MatDialogRef, useClass: MockDialogRef },
                { provide: Router, useClass: MockRouter },
                { provide: ActivatedRoute, useClass: MockActivatedRoute },
                { provide: MatDialog, useClass: MockDialog },
                { provide: UsersService, useClass: MockUsersService },
                // Provide mock TranslateService
                { provide: TranslateService, useClass: MockTranslateService },
                TranslateStore,
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(LoginModalComponent, { set: { template: '<div></div>' } })
            .compileComponents();

        fixture = TestBed.createComponent(LoginModalComponent);
        component = fixture.componentInstance;
        usersService = TestBed.inject(UsersService);
        dialogRef = TestBed.inject(MatDialogRef) as any;
        router = TestBed.inject(Router) as any;
        // Remove direct injection of MockDialog, not needed
        // Remove direct injection of MockTranslateService, not needed
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should patch userName from localStorage on init', () => {
        jest.spyOn(localStorage.__proto__, 'getItem').mockReturnValue('testuser');
        component.ngOnInit();
        expect(component.loginForm.get('userName')?.value).toBe('testuser');
    });

    it('should call usersService.login and close dialog on successful login', () => {
        const closeSpy = jest.spyOn(dialogRef, 'close');
        const loginSpy = jest.spyOn(usersService, 'login').mockReturnValue(of({}));
        const navigateByUrlSpy = jest.spyOn(router, 'navigateByUrl');
        component.loginForm.setValue({ userName: 'user', password: 'pass' });
        component.returnUrl = '/dashboard';
        component.tryLogin();
        expect(loginSpy).toHaveBeenCalledWith('user', 'pass');
        expect(closeSpy).toHaveBeenCalled();
        expect(navigateByUrlSpy).toHaveBeenCalledWith('/dashboard');
    });

    it('should show error dialog on failed login', fakeAsync(() => {
        const error = { message: 'fail' };
        jest.spyOn(usersService, 'login').mockReturnValue({
            subscribe: (observer: { next?: Function; error?: Function }) => {
                if (observer.error) {
                    observer.error(error);
                }
                return new Subscription();
            },
        } as any);
        jest.spyOn(component['translate'], 'get').mockReturnValue(of('Authentication error'));
        component.loginForm.setValue({ userName: 'user', password: 'bad' });
        component.tryLogin();
        tick();
        expect(
            jest.requireMock('../../../src/app/dialogs/error-dialog/error-dialog.component')
                .ErrorDialogComponent.show,
        ).toHaveBeenCalled();
    }));

    it('should close dialog and navigate to / on cancel', () => {
        const closeSpy = jest.spyOn(dialogRef, 'close');
        const navigateSpy = jest.spyOn(router, 'navigate');
        component.processCancel();
        expect(closeSpy).toHaveBeenCalledWith('Cancel click');
        expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });

    it('should return userName and password form controls', () => {
        expect(component.userName).toBe(component.loginForm.get('userName'));
        expect(component.password).toBe(component.loginForm.get('password'));
    });
});
