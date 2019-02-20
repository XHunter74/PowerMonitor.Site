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
  private maxAmperage = 30;
  private nominalAmperageMin = 0;
  private nominalAmperageMax = 20;

  public canvasWidth = 300;
  public centralLabel = '';

  public voltageIndicator = {
    bottomLabel: this.voltage.toString(),
    needleValue: Math.round(230 / this.maxVoltage * 100),
    name: 'Voltage, V',
    options: {
      hasNeedle: true,
      needleColor: 'gray',
      needleUpdateSpeed: 500,
      arcColors: ['red', 'green', 'red'],
      arcDelimiters: [Math.round(this.nominalVoltageMin / this.maxVoltage * 100),
      Math.round(this.nominalVoltageMax / this.maxVoltage * 100)],
      rangeLabel: ['0', this.maxVoltage.toString()],
      needleStartValue: 50,
    }
  };

  public currentIndicator = {
    bottomLabel: '10.0',
    needleValue: 30,
    name: 'Amperage, A',
    options: {
      hasNeedle: true,
      needleColor: 'gray',
      needleUpdateSpeed: 500,
      arcColors: ['red', 'green', 'red'],
      arcDelimiters: [0.5, Math.round(this.nominalAmperageMax / this.maxAmperage * 100)],
      rangeLabel: ['0', this.maxAmperage.toString()],
      needleStartValue: 50,
    }
  };

  constructor(private powerService: PowerService) {
  }

  ngOnInit(): void {
    this.refreshData();
  }

  async refreshData() {
    let isErrorShown = false;
    const interval = setInterval(async () => {
      try {
        const sensorsData = await this.powerService.getSensorsData();
        this.updateGaugeIndicators(sensorsData);
      } catch (e) {
        clearInterval(interval);
        console.log(e);
        if (!isErrorShown) {
          isErrorShown = true;
          alert('Something going wrong!');
        }
      }
    }, 1000);
  }
  updateGaugeIndicators(sensorsData: ISensorsDataModel) {
    this.voltageIndicator.needleValue = Math.round(sensorsData.voltage / this.maxVoltage * 100);
    this.voltageIndicator.bottomLabel = formatNumber(sensorsData.voltage);
    this.currentIndicator.needleValue = Math.round(sensorsData.amperage / this.maxAmperage * 100);
    this.currentIndicator.bottomLabel = formatNumber(sensorsData.amperage);
  }

}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function formatNumber(value: number): any {
  let result = (Math.round(value * 10) / 10).toString();
  if (!result.includes('.')) {
    result += '.0';
  }
  return result;
}
