import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { PlatformInfoComponent } from '../../../src/app/components/platform-info/platform-info.component';
import { AppBaseComponent } from '../../../src/app/components/base-component/app-base.component';
import { PlatformInfoState } from '../../../src/app/store/reducers/platform-info.reducer';
import { loadPlatformInfo } from '../../../src/app/store/actions/platform-info.actions';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

// Mock AppBaseComponent to avoid side effects
class MockAppBaseComponent {}

// Minimal mock for DateAdapter
class MockDateAdapter {
    setLocale() {}
}

describe('PlatformInfoComponent', () => {
    let component: PlatformInfoComponent;
    let fixture: ComponentFixture<PlatformInfoComponent>;
    let store: Store;

    const initialState: PlatformInfoState = {
        loading: false,
        error: null,
        sysInfo: {
            systemUptime: { days: 1, hours: 2, minutes: 3, seconds: 4 },
            systemDateTimeStr: '2024-01-01T12:34:56Z',
        },
        boardInfo: {
            buildDate: '2024-01-01T00:00:00Z',
        },
    } as any;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlatformInfoComponent],
            imports: [StoreModule.forRoot({}, {}), MatDialogModule, TranslateModule.forRoot()],
            providers: [
                { provide: AppBaseComponent, useClass: MockAppBaseComponent },
                { provide: DateAdapter, useClass: MockDateAdapter },
                { provide: MAT_DATE_LOCALE, useValue: 'en' },
                {
                    provide: Store,
                    useValue: {
                        select: () => of(initialState),
                        dispatch: jest.fn(),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PlatformInfoComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(Store);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should dispatch loadPlatformInfo on init', () => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        component.ngOnInit();
        expect(dispatchSpy).toHaveBeenCalledWith(loadPlatformInfo());
    });

    it('should unsubscribe on destroy', () => {
        component.stateSubscription = { unsubscribe: jest.fn() } as any;
        const unsubscribeSpy = jest.spyOn(component.stateSubscription, 'unsubscribe');
        component.ngOnDestroy();
        expect(unsubscribeSpy).toHaveBeenCalled();
    });

    it('should format system uptime string', () => {
        component.sysInfo = {
            systemUptime: { days: 1, hours: 2, minutes: 3, seconds: 4 },
        } as any;
        expect(component.getSystemUptimeStr()).toContain('1 days');
        expect(component.getSystemUptimeStr()).toContain('02:03:04');
    });

    it('should parse system date time', () => {
        component.sysInfo = { systemDateTimeStr: '2024-01-01T12:34:56Z' } as any;
        expect(component.getSystemDateTime()).toBeInstanceOf(Date);
    });
});
