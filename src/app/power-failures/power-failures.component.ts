import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { filter, Subscription } from 'rxjs';

@Component({
    selector: 'app-power-failures',
    templateUrl: './power-failures.component.html'
})
export class PowerFailuresComponent implements OnInit, OnDestroy {
    selectedTab: number = 1;

    private routerSubscription: Subscription;

    constructor(private router: Router) { }


    ngOnInit(): void {
        this.updateSelectedTab();

        this.routerSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.updateSelectedTab();
            });
    }

    ngOnDestroy(): void {
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
    }

    private updateSelectedTab(): void {
        const url = this.router.url;
        if (url.includes('/hourly')) {
            this.selectedTab = 1;
        } else if (url.includes('/daily')) {
            this.selectedTab = 2;
        } else if (url.includes('/monthly')) {
            this.selectedTab = 3;
        } else if (url.includes('/yearly')) {
            this.selectedTab = 4;
        }
    }

    onNavChange(changeEvent: NgbNavChangeEvent) {
        switch (changeEvent.nextId) {
            case 1:
                this.router.navigate(['power-failures', 'hourly']);
                break;
            case 2:
                this.router.navigate(['power-failures', 'daily']);
                break;
            case 3:
                this.router.navigate(['power-failures', 'monthly']);
                break;
            case 4:
                this.router.navigate(['power-failures', 'yearly']);
                break;
        }
    }
}

