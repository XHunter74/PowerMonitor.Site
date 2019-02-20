import { Component, OnInit } from '@angular/core';
import { PowerService } from '../services/power-service';
import { ISensorsDataModel } from '../models/sensors-data.model';

@Component({
  selector: 'app-real-data',
  templateUrl: './real-data.component.html',
})


export class RealDataComponent implements OnInit {

  private maxVoltage = 270;
  private nominalVoltageMin = 200;
  private nominalVoltageMax = 240;
  private voltage = 230;

  public canvasWidth = 300;
  public needleValue = Math.round(230 / this.maxVoltage * 100);
  public centralLabel = '';
  public name = 'Voltage, V';
  public bottomLabel = this.voltage.toString();
  public options = {
    hasNeedle: true,
    needleColor: 'gray',
    needleUpdateSpeed: 500,
    arcColors: ['red', 'green', 'red'],
    arcDelimiters: [Math.round(this.nominalVoltageMin / this.maxVoltage * 100), Math.round(this.nominalVoltageMax / this.maxVoltage * 100)],
    rangeLabel: ['0', this.maxVoltage.toString()],
    needleStartValue: 50,
  };

  constructor(private powerService: PowerService) {
  }

  ngOnInit(): void {
    this.refreshData();
  }

  async refreshData() {
    try {
      while (1 == 1) {
        const sensorsData = await this.powerService.getSensorsData();
        this.updateGaugeIndicator(sensorsData);
        delay(1000);
      }
    } catch (e) {
      console.log(e);
      alert('Something going wrong!');
    }
  }
  updateGaugeIndicator(sensorsData: ISensorsDataModel) {
    this.needleValue = Math.round(sensorsData.voltage / this.maxVoltage * 100);
    this.bottomLabel = (Math.round(sensorsData.voltage * 10) / 10).toString();
  }

}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
