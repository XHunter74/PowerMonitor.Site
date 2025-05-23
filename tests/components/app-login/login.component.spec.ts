import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppLoginComponent } from '../../../src/app/components/app-login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginModalComponent } from '../../../src/app/components/app-login/login-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

jest.mock('../../../src/app/components/app-login/login-modal.component', () => ({
    LoginModalComponent: { show: jest.fn() },
}));

const MockLoginModalComponent = jest.requireMock(
    '../../../src/app/components/app-login/login-modal.component',
).LoginModalComponent;

describe('AppLoginComponent', () => {
    let component: AppLoginComponent;
    let fixture: ComponentFixture<AppLoginComponent>;
    let matDialog: MatDialog;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AppLoginComponent],
            providers: [{ provide: MatDialog, useValue: { open: jest.fn() } }],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(AppLoginComponent);
        component = fixture.componentInstance;
        matDialog = TestBed.inject(MatDialog);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call LoginModalComponent.show on ngAfterViewInit', () => {
        component.ngAfterViewInit();
        expect(MockLoginModalComponent.show).toHaveBeenCalledWith(matDialog);
    });
});
