import { Component } from '@angular/core';
import { PowerService } from '../services/power-service';
import { from } from 'rxjs';

@Component({
    selector: 'app-power-monitor',
    templateUrl: './power-monitor.component.html'
})
export class PowerMonitorComponent {

    private voltageData;

    constructor(private powerService: PowerService) {
        this.refreshData();
    }

    public lineChartData: Array<any> = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    ];
    public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'];
    public lineChartOptions: any = {
        responsive: true
    };
    public lineChartColors: Array<any> = [
        { // dark grey
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        }
    ];
    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';

    // events
    public chartClicked(e: any): void {
        console.log(e);
    }

    public chartHovered(e: any): void {
        console.log(e);
    }

    async refreshData() {
        try {
            const currentDate = new Date();
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            const finishDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());;
            finishDate.setDate(finishDate.getDate() + 1);
            this.voltageData = await this.powerService.getVoltageData(startDate, finishDate);
        } catch (e) {
            alert('Something going wrong!');
        }
    }
}

