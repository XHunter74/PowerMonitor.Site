import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDatepickerInputEvent, MatSort, MatTableDataSource, Sort, SortDirection, MatSortHeader } from '@angular/material';

import { PowerService } from '../services/power-service';
import { AppBaseComponent } from '../base-component/app-base.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

const VoltageAmperageHourlySort = 'voltage-amperage-hourly-sort;'

@Component({
    selector: 'app-voltage-amperage-hourly',
    templateUrl: './voltage-amperage-hourly.component.html',
    styleUrls: ['./voltage-amperage-hourly.component.css']
})
export class VoltageAmperageHourlyComponent extends AppBaseComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(MatSort) sort: MatSort;
    sortedData = new MatTableDataSource();
    displayedColumns: string[] = ['created', 'hours', 'voltageMax', 'voltageMin',
        'voltageAvg', 'amperageMax', 'amperageMin', 'amperageAvg'];
    public currentDate: Date;
    currentDateControl: FormControl = new FormControl();

    constructor(private powerService: PowerService,
        private activatedRouter: ActivatedRoute,
        private router: Router,
        dialog: MatDialog) {
        super(dialog);
    }

    ngAfterViewInit() {
        const restoredSortStr = localStorage.getItem(VoltageAmperageHourlySort);
        if (restoredSortStr) {
            const restoredSort = <Sort>JSON.parse(restoredSortStr)
            if (restoredSort.active && restoredSort.direction) {
                this.sort.active = restoredSort.active;
                this.sort.direction = restoredSort.direction as SortDirection;
                const toState = 'active';
                (this.sort.sortables.get(restoredSort.active) as MatSortHeader)
                    ._setAnimationTransitionState({ toState });
                // this.sort.sortChange.emit();
                // this.sort._stateChanges.next();
            }
        }
        this.sortedData.sort = this.sort;
    }

    ngOnInit(): void {
        this.activatedRouter.params.subscribe(
            params => {
                const year = params['year'];
                const month = params['month'];
                const day = params['day'];
                if (year && month && day) {
                    // tslint:disable-next-line: radix
                    this.currentDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                } else {
                    this.currentDate = new Date();
                }
            }
        );
        this.currentDateControl.setValue(this.currentDate.toISOString());
        this.refreshData();
    }

    async dateChanged(event: MatDatepickerInputEvent<Date>) {
        this.currentDate = new Date(event.value);
        this.router.navigate(['voltage-amperage', 'hourly',
            { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1, day: this.currentDate.getDate() }]);
        await this.refreshData();
    }

    async refreshData() {
        setTimeout(async () => {
            this.showSpinner();
            try {
                const voltageData = await this.powerService.getVoltageAmperageData(this.currentDate, this.currentDate);
                this.sortedData.data = voltageData;
                this.closeSpinner();
            } catch (e) {
                this.closeSpinner();
                setTimeout(() => alert('Something going wrong!'));
            }
        });
    }

    sortData(sort: Sort): void {
        if (sort) {
            localStorage.setItem(VoltageAmperageHourlySort, JSON.stringify(sort));
        }
    }
}

