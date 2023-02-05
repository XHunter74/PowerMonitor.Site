import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-power-failures',
    templateUrl: './power-failures.component.html'
})
export class PowerFailuresComponent implements OnInit, AfterViewChecked {
    selectedTab: string;

    @ViewChild('tabs', { static: true })
    private tabs: NgbTabset;

    constructor(private route: ActivatedRoute) {
        this.route.data.subscribe(d => {
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

