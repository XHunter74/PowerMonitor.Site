import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-power-monitor',
    templateUrl: './power-monitor.component.html'
})
export class PowerMonitorComponent implements OnInit, AfterViewChecked {
    selectedTab: string;

    @ViewChild('tabs')
    private tabs: NgbTabset;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router, ) {
        if (router.url === '/' || router.url.toLowerCase() === '/power-monitor') {
            router.navigate(['power-monitor', 'hourly'])
        }
        this.activatedRoute.data.subscribe(d => {
            this.selectedTab = d.name;
        });
    }

    ngOnInit(): void {
    }

    ngAfterViewChecked(): void {
        if (this.tabs) {
            //this.tabs.select(this.selectedTab);
        }
    }
}

