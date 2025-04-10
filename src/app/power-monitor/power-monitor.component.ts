import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-power-monitor',
    templateUrl: './power-monitor.component.html',

})
export class PowerMonitorComponent implements OnInit {
    selectedTab: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,) { }

    ngOnInit(): void {
        if (this.router.url === '/' || this.router.url.toLowerCase() === '/power-monitor') {
            this.router.navigate(['power-monitor', 'hourly'])
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
}

