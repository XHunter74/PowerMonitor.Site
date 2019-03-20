import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISensorsDataModel } from '../models/sensors-data.model';
import { WebSocketService } from '../services/websocket.service';

@Component({
  selector: 'app-real-data',
  templateUrl: './real-data.component.html',
})


export class RealDataComponent implements OnInit, OnDestroy {

  private maxVoltage = 270;
  private nominalVoltageMin = 200;
  private nominalVoltageMax = 240;
  private voltage = 230;
  private maxAmperage = 30;
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
    bottomLabel: '0.0',
    needleValue: 0,
    name: 'Amperage, A',
    options: {
      hasNeedle: true,
      needleColor: 'gray',
      needleUpdateSpeed: 500,
      arcColors: ['green', 'red'],
      arcDelimiters: [Math.round(this.nominalAmperageMax / this.maxAmperage * 100)],
      rangeLabel: ['0', this.maxAmperage.toString()],
      needleStartValue: 0,
    }
  };

  constructor(private webSocketService: WebSocketService) {
  }

  ngOnInit(): void {
    this.webSocketService.sendMessage('sensors-data');
    this.webSocketService.getSensorsData()
      .subscribe((data: ISensorsDataModel) => {
        this.updateGaugeIndicators(data);
      });
  }

  ngOnDestroy(): void {
    this.webSocketService.sendMessage('close-sensors-data');
  }

  updateGaugeIndicators(sensorsData: ISensorsDataModel) {
    this.voltageIndicator.needleValue = Math.round(sensorsData.voltage / this.maxVoltage * 100);
    this.voltageIndicator.bottomLabel = formatNumber(sensorsData.voltage);
    this.currentIndicator.needleValue = Math.round(sensorsData.amperage / this.maxAmperage * 100);
    this.currentIndicator.bottomLabel = formatNumber(sensorsData.amperage);
  }

}

function formatNumber(value: number): any {
  let result = (Math.round(value * 10) / 10).toString();
  if (!result.includes('.')) {
    result += '.0';
  }
  return result;
}
