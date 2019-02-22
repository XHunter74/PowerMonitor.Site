import { Component } from '@angular/core';
import { Sort } from '@angular/material';

import { PowerService } from '../services/power-service';
import { IVoltageAmperageModel } from '../models/voltage-amperage.model';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { compare } from '../utils';

@Component({
    selector: 'app-voltage-amperage-hourly',
    templateUrl: './voltage-amperage-hourly.component.html'
})
export class VoltageAmperageHourlyComponent {

    public voltageData: IVoltageAmperageModel[];
    public currentDate: NgbDate;

    constructor(private powerService: PowerService) {
        const today = new Date();
        this.currentDate = new NgbDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
        this.refreshData();
    }

    async refreshData() {
        try {
            const startDate = new Date();
            const finishDate = new Date();
            this.voltageData = await this.powerService.getVoltageAmperageData(startDate, finishDate);
        } catch (e) {
            alert('Something going wrong!');
        }
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

