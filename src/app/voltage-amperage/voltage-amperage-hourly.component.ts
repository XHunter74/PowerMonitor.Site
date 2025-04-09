import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { PowerService } from '../services/power-service';
import { AppBaseComponent } from '../base-component/app-base.component';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IVoltageAmperageModel } from '../models/voltage-amperage.model';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { Constants } from '../constants';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSort, Sort, MatSortHeader } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, catchError, finalize, of, tap } from 'rxjs';

const VoltageAmperageHourlySort = 'voltage-amperage-hourly-sort';

@Component({
    selector: 'app-voltage-amperage-hourly',
    templateUrl: './voltage-amperage-hourly.component.html',
    styleUrls: ['./voltage-amperage-hourly.component.css']
})
export class VoltageAmperageHourlyComponent extends AppBaseComponent implements OnInit, OnDestroy {

    @ViewChild(MatSort, { static: true }) sort: MatSort;
    sortedData = new MatTableDataSource();
    displayedColumns: string[] = ['created', 'hours', 'voltageMax', 'voltageMin',
        'voltageAvg', 'amperageMax', 'amperageMin', 'amperageAvg'];

    currentDate$ = new BehaviorSubject(<Date>(new Date()));
    public currentDate: Date = this.currentDate$.getValue();;
    currentDateControl: UntypedFormControl = new UntypedFormControl();
    maxVoltage: IVoltageAmperageModel;
    minVoltage: IVoltageAmperageModel;
    maxAmperage: IVoltageAmperageModel;
    minAmperage: IVoltageAmperageModel;

    constructor(private powerService: PowerService,
        private activatedRouter: ActivatedRoute,
        private router: Router,
        dialog: MatDialog,
        translate: TranslateService) {
        super(dialog, translate);
        this.refreshData = this.refreshData.bind(this);
    }

    restoreSort() {
        const sort = this.sortedData.sort;
        const restoredSortStr = localStorage.getItem(VoltageAmperageHourlySort);
        if (restoredSortStr) {
            const restoredSort = <Sort>JSON.parse(restoredSortStr);
            if (restoredSort.active && restoredSort.direction) {
                sort.sort({ id: null, start: restoredSort.direction, disableClear: false });
                sort.sort({ id: restoredSort.active, start: restoredSort.direction, disableClear: false });
                const sortable = sort.sortables.get(restoredSort.active);
                if (sortable) {
                    (sortable as MatSortHeader)._setAnimationTransitionState({ toState: 'active' });
                } 
            }
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.currentDate$.complete();
        this.currentDate$.unsubscribe();
    }

    ngOnInit() {
        this.activatedRouter.queryParams.subscribe(
            params => {
                const year = params['year'];
                const month = params['month'];
                const day = params['day'];
                if (year && month && day) {
                    // tslint:disable-next-line: radix
                    this.currentDate$.next(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
                } else {
                    this.currentDate$.next(new Date());
                }
            }
        );
        this.currentDateControl.setValue(this.currentDate.toISOString());
        this.sortedData.sort = this.sort;
        this.currentDate$.subscribe(this.refreshData);
        this.restoreSort();
    }

    dateChanged(event: MatDatepickerInputEvent<Date>) {
        this.currentDate$.next(new Date(event.value));
        this.router.navigate(['voltage-amperage', 'hourly'],
            { queryParams: { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1, day: this.currentDate.getDate() } });
    }

    refreshData() {
        var spinnerRef = this.showSpinner();
        this.powerService.getVoltageAmperageDataNew(this.currentDate).pipe(
            tap(voltageData => this.processReceivedData(voltageData)),
            catchError(() => {
                this.translate.get('ERRORS.COMMON')
                    .subscribe(errorText => {
                        ErrorDialogComponent.show(this.dialog, errorText);
                    });
                return of([]);
            }),
            finalize(() => spinnerRef.close())
        ).subscribe();
    }

    processReceivedData(data: IVoltageAmperageModel[]) {
        this.sortedData.data = data;
        this.maxVoltage =
            data.find(o => o.voltageMax === Math.max(...data.map(e => e.voltageMax)));
        this.minVoltage =
            data.find(o => o.voltageMin === Math.min(...data.map(e => e.voltageMin)));
        this.maxAmperage =
            data.find(o => o.amperageMax === Math.max(...data.map(e => e.amperageMax)));
        this.minAmperage =
            data.find(o => o.amperageMin === Math.min(...data.map(e => e.amperageMin)));
    }

    sortData(sort: Sort): void {
        if (sort) {
            localStorage.setItem(VoltageAmperageHourlySort, JSON.stringify(sort));
        }
    }

    addDay(direction: string) {
        if (direction === 'up') {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
        } else {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
        }
        this.currentDateControl.setValue(this.currentDate.toISOString());
        this.router.navigate(['voltage-amperage', 'hourly'],
            { queryParams: { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1, day: this.currentDate.getDate() } });
        this.refreshData();
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

