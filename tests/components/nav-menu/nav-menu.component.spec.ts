// Co-located unit test for NavMenuComponent
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NavMenuComponent } from '../../../src/app/components/nav-menu/nav-menu.component';
import { Router } from '@angular/router';
import { InfoService } from '../../../src/app/services/info-service';
import { AuthService } from '../../../src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError, Subscription } from 'rxjs';
import { Constants } from '../../../src/app/constants';
import { TranslateModule } from '@ngx-translate/core';

// Silence console.error from component API error handling
jest.spyOn(console, 'error').mockImplementation(() => {});

// Mock the ChangeLanguageDialogComponent
jest.mock(
    '../../../src/app/dialogs/change-language-dialog/change-language-dialog.component',
    () => ({ ChangeLanguageDialogComponent: { show: jest.fn() } }),
);
const MockChangeLanguageDialogComponent = jest.requireMock(
    '../../../src/app/dialogs/change-language-dialog/change-language-dialog.component',
).ChangeLanguageDialogComponent;

describe('NavMenuComponent', () => {
    let component: NavMenuComponent;
    let fixture: ComponentFixture<NavMenuComponent>;
    let authService: AuthService;
    let infoService: InfoService;
    let router: Router;
    let dialog: MatDialog;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [NavMenuComponent],
            imports: [TranslateModule.forRoot()],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        isAuthenticated: of(true),
                        logout: jest.fn(),
                        isSignedIn: true,
                        userRole: 'admin',
                    },
                },
                {
                    provide: InfoService,
                    useValue: { pingApi: jest.fn(() => of({ response: Constants.PongResponse })) },
                },
                { provide: Router, useValue: { navigate: jest.fn() } },
                { provide: MatDialog, useValue: { open: jest.fn() } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(NavMenuComponent);
        component = fixture.componentInstance;
        authService = TestBed.inject(AuthService);
        infoService = TestBed.inject(InfoService);
        router = TestBed.inject(Router);
        dialog = TestBed.inject(MatDialog);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle isExpanded on toggle()', () => {
        component.isExpanded = false;
        component.toggle();
        expect(component.isExpanded).toBe(true);
        component.toggle();
        expect(component.isExpanded).toBe(false);
    });

    it('should call ChangeLanguageDialogComponent.show on changeLanguage()', async () => {
        await component.changeLanguage();
        expect(MockChangeLanguageDialogComponent.show).toHaveBeenCalledWith(dialog);
    });

    it('should set isAPIOnline to true when API is online', () => {
        jest.spyOn(infoService, 'pingApi').mockReturnValue(
            of({ response: Constants.PongResponse }),
        );
        component['checkApiState']();
        expect(component.isAPIOnline).toBe(true);
    });

    it('should set isAPIOnline to false when API is offline', () => {
        jest.spyOn(infoService, 'pingApi').mockReturnValue(
            throwError(() => new Error('API error')),
        );
        component['checkApiState']();
        expect(component.isAPIOnline).toBe(false);
    });

    it('should return correct apiState values', () => {
        component.isAPIOnline = undefined as any;
        expect(component.apiState).toBe(0);

        component.isAPIOnline = false;
        expect(component.apiState).toBe(1);

        component.isAPIOnline = true;
        expect(component.apiState).toBe(2);
    });

    it('should call authService.logout on logout()', () => {
        const logoutSpy = jest.spyOn(authService, 'logout');
        component.logout();
        expect(logoutSpy).toHaveBeenCalled();
    });

    it('should navigate to /app-login on logout when user is not authenticated', () => {
        jest.spyOn(authService.isAuthenticated, 'subscribe').mockImplementation((next) => {
            next(false);
            return new Subscription();
        });
        component.ngOnInit();
        expect(router.navigate).toHaveBeenCalledWith(['/app-login']);
    });
});
