import { PowerFailuresComponent } from '../../../src/app/components/power-failures/power-failures.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { NgbNavChangeEvent, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

class MockRouter {
    url = '/power-failures/hourly';
    events = new Subject();
    navigate = jest.fn();
}

describe('PowerFailuresComponent', () => {
    let component: PowerFailuresComponent;
    let fixture: ComponentFixture<PowerFailuresComponent>;
    let router: MockRouter;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PowerFailuresComponent],
            imports: [NgbNavModule, TranslateModule.forRoot()],
            providers: [{ provide: Router, useClass: MockRouter }],
        }).compileComponents();

        fixture = TestBed.createComponent(PowerFailuresComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router) as any;
    });

    describe('ngOnInit', () => {
        it('should set selectedTab based on url and subscribe to router events', () => {
            router.url = '/power-failures/daily';
            const updateSelectedTabSpy = jest.spyOn(component as any, 'updateSelectedTab');
            component.ngOnInit();
            expect(updateSelectedTabSpy).toHaveBeenCalled();
            // Simulate navigation event
            router.url = '/power-failures/monthly';
            (router.events as Subject<any>).next(
                new NavigationEnd(1, '/power-failures/monthly', '/'),
            );
            expect(updateSelectedTabSpy).toHaveBeenCalledTimes(2);
        });
    });

    describe('ngOnDestroy', () => {
        it('should unsubscribe from routerSubscription if present', () => {
            (component as any).routerSubscription = { unsubscribe: jest.fn() } as any;
            const unsubSpy = jest.spyOn((component as any).routerSubscription, 'unsubscribe');
            component.ngOnDestroy();
            expect(unsubSpy).toHaveBeenCalled();
        });
        it('should not throw if routerSubscription is undefined', () => {
            (component as any).routerSubscription = undefined;
            expect(() => component.ngOnDestroy()).not.toThrow();
        });
    });

    describe('updateSelectedTab', () => {
        it('should set selectedTab to 1 for /hourly', () => {
            router.url = '/power-failures/hourly';
            (component as any).updateSelectedTab();
            expect(component.selectedTab).toBe(1);
        });
        it('should set selectedTab to 2 for /daily', () => {
            router.url = '/power-failures/daily';
            (component as any).updateSelectedTab();
            expect(component.selectedTab).toBe(2);
        });
        it('should set selectedTab to 3 for /monthly', () => {
            router.url = '/power-failures/monthly';
            (component as any).updateSelectedTab();
            expect(component.selectedTab).toBe(3);
        });
        it('should set selectedTab to 4 for /yearly', () => {
            router.url = '/power-failures/yearly';
            (component as any).updateSelectedTab();
            expect(component.selectedTab).toBe(4);
        });
        it('should not change selectedTab for unknown url', () => {
            router.url = '/power-failures/unknown';
            component.selectedTab = 99;
            (component as any).updateSelectedTab();
            expect(component.selectedTab).toBe(99);
        });
    });

    describe('onNavChange', () => {
        it('should navigate to hourly when nextId is 1', () => {
            component.onNavChange({ nextId: 1 } as NgbNavChangeEvent);
            expect(router.navigate).toHaveBeenCalledWith(['power-failures', 'hourly']);
        });
        it('should navigate to daily when nextId is 2', () => {
            component.onNavChange({ nextId: 2 } as NgbNavChangeEvent);
            expect(router.navigate).toHaveBeenCalledWith(['power-failures', 'daily']);
        });
        it('should navigate to monthly when nextId is 3', () => {
            component.onNavChange({ nextId: 3 } as NgbNavChangeEvent);
            expect(router.navigate).toHaveBeenCalledWith(['power-failures', 'monthly']);
        });
        it('should navigate to yearly when nextId is 4', () => {
            component.onNavChange({ nextId: 4 } as NgbNavChangeEvent);
            expect(router.navigate).toHaveBeenCalledWith(['power-failures', 'yearly']);
        });
        it('should do nothing for unknown nextId', () => {
            component.onNavChange({ nextId: 99 } as NgbNavChangeEvent);
            expect(router.navigate).not.toHaveBeenCalled();
        });
    });
});
