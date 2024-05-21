import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbNav, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-power-failures',
    templateUrl: './power-failures.component.html'
})
export class PowerFailuresComponent implements OnInit, AfterViewChecked {
    selectedTab: number;

    @ViewChild('nav', { static: true })
    private tabs: NgbNav;

    constructor(private route: ActivatedRoute,
        private router: Router) {
        this.route.data.subscribe(d => {
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

    ngOnInit(): void {
    }

    ngAfterViewChecked(): void {
        if (this.tabs) {
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
        }
    }
}

