import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISensorsDataModel } from '../models/sensors-data.model';
import { WebSocketService } from '../services/websocket.service';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';


@Component({
  selector: 'app-real-data',
  templateUrl: './real-data.component.html',
  styleUrls: ['./real-data.component.css']
})


export class RealDataComponent implements OnInit, OnDestroy {

  private maxVoltage = 300;
  private nominalVoltageMin = 207;
  private nominalVoltageMax = 253;
  private voltage = 230;
  private maxAmperage = 30;
  private nominalAmperageMax = 20;
  private maxPower = 8;
  private nominalPowerMax = 5;

  voltageChart = {
    type: "Gauge",
    data: [
      ["Voltage", { v: this.voltage, f: `${this.voltage} V` }],
    ],
    options: {
      width: 200,
      height: 200,
      redFrom: 0,
      redTo: this.nominalVoltageMin,
      greenFrom: this.nominalVoltageMin,
      greenTo: this.nominalVoltageMax,
      yellowFrom: this.nominalVoltageMax,
      yellowTo: this.maxVoltage,
      min: 0,
      max: this.maxVoltage,
      yellowColor: '#DC3912'
    },
  };

  amperageChart = {
    type: "Gauge",
    data: [
      ["Amperage", { v: 0, f: '0 A' }],
    ],
    options: {
      width: 200,
      height: 200,
      greenFrom: 0,
      greenTo: this.nominalAmperageMax,
      redFrom: this.nominalAmperageMax,
      redTo: this.maxAmperage,
      min: 0,
      max: this.maxAmperage,
    },
  };

  powerChart = {
    type: "Gauge",
    data: [
      ["Power", { v: 0, f: '0 kW' }],
    ],
    options: {
      width: 200,
      height: 200,
      greenFrom: 0,
      greenTo: this.nominalPowerMax,
      redFrom: this.nominalPowerMax,
      redTo: this.maxPower,
      min: 0,
      max: this.maxPower,
    },
  };

  timerSub: Subscription;

  constructor(private webSocketService: WebSocketService) {
  }

  ngOnInit(): void {
    this.initSocketConnection();
    this.timerSub = interval(1000).subscribe(() => {
      if (!this.webSocketService.isConnected) {
        this.initSocketConnection();
      }
    }
    );
  }

  initSocketConnection() {
    if (!this.webSocketService.isConnected) {
      this.webSocketService.openServer();
      this.webSocketService.sendMessage('sensors-data');
      this.webSocketService.getSensorsData()
        .subscribe((data: ISensorsDataModel) => {
          this.updateGaugeIndicators(data);
        });
    }
  }

  ngOnDestroy(): void {
    this.webSocketService.closeSensorsData();
    this.timerSub.unsubscribe();
  }

  updateGaugeIndicators(data: ISensorsDataModel) {
    const voltage = Math.round(data.voltage);
    this.voltageChart.data = [
      ["Voltage", { v: voltage, f: `${voltage} V` }],
    ];
    const amperage = Math.round(data.amperage * 10) / 10;
    this.amperageChart.data = [
      ["Amperage", { v: amperage, f: `${amperage} A` }],
    ];
    const power = Math.round(data.power * 10) / 10;
    this.powerChart.data = [
      ["Power", { v: power, f: `${power} kW` }],
    ];
  }

}
