import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Sort } from '@angular/material/sort';

import { PowerService } from '../services/power-service';
import { IVoltageAmperageModel } from '../models/voltage-amperage.model';
import { compare } from '../utils';
import { AppBaseComponent } from '../base-component/app-base.component';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorDialogComponent } from '../dialogs/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-voltage-amperage-daily',
    templateUrl: './voltage-amperage-daily.component.html'
})
export class VoltageAmperageDailyComponent extends AppBaseComponent implements OnInit, OnDestroy {

    public voltageData: IVoltageAmperageModel[];
    public currentDate: Date;
    currentDateControl: UntypedFormControl = new UntypedFormControl();

    constructor(private powerService: PowerService,
        private activatedRouter: ActivatedRoute,
        private router: Router,
        dialog: MatDialog) {
        super(dialog);
    }

    async ngOnInit() {
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
        await this.refreshData();
    }

    async dateChanged(event: MatDatepickerInputEvent<Date>) {
        this.currentDate = new Date(event.value);
        this.router.navigate(['voltage-amperage', 'daily',
            { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1, day: this.currentDate.getDate() }]);
        await this.refreshData();
    }

    async refreshData() {
        setTimeout(async () => {
            this.showSpinner();
            try {
                this.voltageData = await this.powerService.getVoltageAmperageData(this.currentDate, this.currentDate);
                this.closeSpinner();
            } catch (e) {
                this.closeSpinner();
                setTimeout(() => ErrorDialogComponent.show(this.dialog, 'Something going wrong!'));
            }
        });
    }

    sortData(sort: Sort) {
        const data = this.voltageData.slice();
        if (!sort.active || sort.direction === '') {
            this.voltageData = data;
            return;
        }

        this.voltageData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'created': return compare(a.created, b.created, isAsc);
                case 'hours': return compare(a.hours, b.hours, isAsc);
                case 'voltageMax': return compare(a.voltageMax, b.voltageMax, isAsc);
                case 'voltageMin': return compare(a.voltageMin, b.voltageMin, isAsc);
                case 'voltageAvg': return compare(a.voltageAvg, b.voltageAvg, isAsc);
                case 'amperageMax': return compare(a.amperageMax, b.amperageMax, isAsc);
                case 'amperageMin': return compare(a.amperageMin, b.amperageMin, isAsc);
                case 'amperageAvg': return compare(a.amperageAvg, b.amperageAvg, isAsc);
                default: return 0;
            }
        });
    }

}

