import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-power-monitor',
    templateUrl: './power-monitor.component.html'
})
export class PowerMonitorComponent implements OnInit, AfterViewChecked {
    selectedTab: string;

    @ViewChild('tabs')
    private tabs: NgbTabset;

    constructor(private route: ActivatedRoute) {
        this.route.data.subscribe(d => {
            this.selectedTab = d.name;
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe(
            params => {
                // this.prospectId = +params['prospectid'];
            }
        );
    }

    ngAfterViewChecked(): void {
        if (this.tabs) {
            //this.tabs.select(this.selectedTab);
        }
    }
}

