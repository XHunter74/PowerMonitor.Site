import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-voltage-amperage',
    templateUrl: './voltage-amperage.component.html'
})
export class VoltageAmperageComponent {
    selectedTab: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,) {
        if (router.url === '/' || router.url.toLowerCase() === '/voltage-amperage') {
            router.navigate(['voltage-amperage', 'hourly'])
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

            }
        });
    }

    onNavChange(changeEvent: NgbNavChangeEvent) {
        switch (changeEvent.nextId) {
            case 1:
                this.router.navigate(['voltage-amperage', 'hourly']);
                break;
            case 2:
                this.router.navigate(['voltage-amperage', 'daily']);
                break;
            case 3:
                this.router.navigate(['voltage-amperage', 'monthly']);
                break;
        }
    }
}

