import { Component } from '@angular/core';
import { Sort } from '@angular/material';

import { PowerService } from '../services/power-service';
import { IVoltageAmperageModel } from '../models/voltage-amperage.model';

@Component({
    selector: 'voltage-amperage',
    templateUrl: './voltage-amperage.component.html'
})
export class VoltageAmperageComponent {

    public voltageData: IVoltageAmperageModel[];

    constructor(private powerService: PowerService) {
        this.refreshData();
    }

    async refreshData() {
        try {
            const currentDate = new Date();
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const finishDate = new Date(currentDate.getFullYear(), currentDate.getMonth(),
                daysInMonth(currentDate.getFullYear(), currentDate.getMonth() + 1));
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

function daysInMonth(year: number, month: number) {
    const days = new Date(year, month, 0).getDate();
    return days;
}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
