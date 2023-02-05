import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDatepickerInputEvent, MatSort, MatTableDataSource, Sort, SortDirection, MatSortHeader } from '@angular/material';

import { PowerService } from '../services/power-service';
import { AppBaseComponent } from '../base-component/app-base.component';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IVoltageAmperageModel } from '../models/voltage-amperage.model';
import { ErrorDialogComponent } from '../dialogs/error-dialog.component';
import { Constants } from '../constants';

const VoltageAmperageHourlySort = 'voltage-amperage-hourly-sort';

@Component({
    selector: 'app-voltage-amperage-hourly',
    templateUrl: './voltage-amperage-hourly.component.html',
    styleUrls: ['./voltage-amperage-hourly.component.css']
})
export class VoltageAmperageHourlyComponent extends AppBaseComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(MatSort, { static: true }) sort: MatSort;
    sortedData = new MatTableDataSource();
    displayedColumns: string[] = ['created', 'hours', 'voltageMax', 'voltageMin',
        'voltageAvg', 'amperageMax', 'amperageMin', 'amperageAvg'];
    public currentDate: Date;
    currentDateControl: FormControl = new FormControl();
    maxVoltage: IVoltageAmperageModel;
    minVoltage: IVoltageAmperageModel;
    maxAmperage: IVoltageAmperageModel;
    minAmperage: IVoltageAmperageModel;

    constructor(private powerService: PowerService,
        private activatedRouter: ActivatedRoute,
        private router: Router,
        dialog: MatDialog) {
        super(dialog);
    }

    ngAfterViewInit() {
        this.sortedData.sort = this.sort;
        this.restoreSort();
    }
    restoreSort() {
        const sort = this.sortedData.sort;
        const restoredSortStr = localStorage.getItem(VoltageAmperageHourlySort);
        if (restoredSortStr) {
            const restoredSort = <Sort>JSON.parse(restoredSortStr);
            if (restoredSort.active && restoredSort.direction) {
                sort.sort({ id: null, start: restoredSort.direction, disableClear: false });
                sort.sort({ id: restoredSort.active, start: restoredSort.direction, disableClear: false });
                (sort.sortables.get(restoredSort.active) as MatSortHeader)
                    ._setAnimationTransitionState({ toState: 'active' });
            }
        }
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
                this.maxVoltage =
                    voltageData.find(o => o.voltageMax === Math.max.apply(null, voltageData.map(e => e.voltageMax)));
                this.minVoltage =
                    voltageData.find(o => o.voltageMin === Math.min.apply(null, voltageData.map(e => e.voltageMin)));
                this.maxAmperage =
                    voltageData.find(o => o.amperageMax === Math.max.apply(null, voltageData.map(e => e.amperageMax)));
                this.minAmperage =
                    voltageData.find(o => o.amperageMin === Math.min.apply(null, voltageData.map(e => e.amperageMin)));
                this.closeSpinner();
            } catch (e) {
                this.closeSpinner();
                setTimeout(() => ErrorDialogComponent.show(this.dialog, 'Something going wrong!'));
            }
        });
    }

    sortData(sort: Sort): void {
        if (sort) {
            localStorage.setItem(VoltageAmperageHourlySort, JSON.stringify(sort));
        }
    }

    async addDay(direction: string) {
        if (direction === 'up') {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
        } else {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
        }
        this.currentDateControl.setValue(this.currentDate.toISOString());
        this.router.navigate(['voltage-amperage', 'hourly',
            { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1, day: this.currentDate.getDate() }]);
        await this.refreshData();
    }

    isAddDayButtonDisabled(direction: string): boolean {
        const nextDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(),
            this.currentDate.getDate());
        if (direction === 'up') {
            nextDate.setDate(nextDate.getDate() + 1);
            return nextDate > new Date();
        } else {
            nextDate.setDate(nextDate.getDate() - 1);
            return nextDate < Constants.systemStartDate;
        }
    }
}

