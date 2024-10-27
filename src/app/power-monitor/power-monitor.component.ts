import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-power-monitor',
    templateUrl: './power-monitor.component.html',

})
export class PowerMonitorComponent {
    selectedTab: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,) {
        if (router.url === '/' || router.url.toLowerCase() === '/power-monitor') {
            router.navigate(['power-monitor', 'hourly'])
        }
        this.activatedRoute.data.subscribe(d => {
            switch (d.name) {
                case "hourly":
                    this.selectedTab = 1;
                    break;
                case "daily":
                    this.selectedTab = 2;
                    break;
                case "monthly":
                    this.selectedTab = 3;
                    break;
                case "yearly":
                    this.selectedTab = 4;
                    break;
            }
        });
    }

    onNavChange(changeEvent: NgbNavChangeEvent) {
        switch (changeEvent.nextId) {
            case 1:
                this.router.navigate(['power-monitor', 'hourly']);
                break;
            case 2:
                this.router.navigate(['power-monitor', 'daily']);
                break;
            case 3:
                this.router.navigate(['power-monitor', 'monthly']);
                break;
            case 4:
                this.router.navigate(['power-monitor', 'yearly']);
                break;
        }
    }
}

