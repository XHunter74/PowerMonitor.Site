import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PowerMonitorComponent } from '../../../src/app/components/power-monitor/power-monitor.component';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Mock Router
class MockRouter {
    url = '/power-monitor/hourly';
    events = new Subject<any>();
    navigate = jest.fn();
}

describe('PowerMonitorComponent', () => {
    let component: PowerMonitorComponent;
    let fixture: ComponentFixture<PowerMonitorComponent>;
    let router: MockRouter;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PowerMonitorComponent],
            providers: [{ provide: Router, useClass: MockRouter }],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(PowerMonitorComponent, { set: { template: '<div></div>' } })
            .compileComponents();

        fixture = TestBed.createComponent(PowerMonitorComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router) as any;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set selectedTab based on url (hourly)', () => {
        router.url = '/power-monitor/hourly';
        component['updateSelectedTab']();
        expect(component.selectedTab).toBe(1);
    });

    it('should set selectedTab based on url (daily)', () => {
        router.url = '/power-monitor/daily';
        component['updateSelectedTab']();
        expect(component.selectedTab).toBe(2);
    });

    it('should set selectedTab based on url (monthly)', () => {
        router.url = '/power-monitor/monthly';
        component['updateSelectedTab']();
        expect(component.selectedTab).toBe(3);
    });

    it('should set selectedTab based on url (yearly)', () => {
        router.url = '/power-monitor/yearly';
        component['updateSelectedTab']();
        expect(component.selectedTab).toBe(4);
    });

    it('should unsubscribe from router events on destroy', () => {
        component['routerSubscription'] = { unsubscribe: jest.fn() } as any;
        const unsub = jest.spyOn(component['routerSubscription'], 'unsubscribe');
        component.ngOnDestroy();
        expect(unsub).toHaveBeenCalled();
    });

    it('should navigate to correct route on nav change', () => {
        component.onNavChange({ nextId: 1 } as any);
        expect(router.navigate).toHaveBeenCalledWith(['power-monitor', 'hourly']);
        component.onNavChange({ nextId: 2 } as any);
        expect(router.navigate).toHaveBeenCalledWith(['power-monitor', 'daily']);
        component.onNavChange({ nextId: 3 } as any);
        expect(router.navigate).toHaveBeenCalledWith(['power-monitor', 'monthly']);
        component.onNavChange({ nextId: 4 } as any);
        expect(router.navigate).toHaveBeenCalledWith(['power-monitor', 'yearly']);
    });

    it('should update selectedTab on NavigationEnd event', () => {
        component.selectedTab = 1;
        router.url = '/power-monitor/monthly';
        // Emit a real NavigationEnd event
        const { NavigationEnd } = jest.requireActual('@angular/router');
        router.events.next(
            new NavigationEnd(1, '/power-monitor/monthly', '/power-monitor/monthly'),
        );
        expect(component.selectedTab).toBe(3);
    });
});
