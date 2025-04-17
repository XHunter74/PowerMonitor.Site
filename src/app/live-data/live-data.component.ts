import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISensorsDataModel } from '../models/sensors-data.model';
import { WebSocketService } from '../services/websocket.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { interval } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-live-data',
  templateUrl: './live-data.component.html',
  styleUrls: ['./live-data.component.css']
})


export class LiveDataComponent implements OnInit, OnDestroy {

  private maxVoltage = 300;
  private nominalVoltageMin = 207;
  private nominalVoltageMax = 253;
  private voltage = 230;
  private amperage = 0;
  private power = 0;
  private maxAmperage = 30;
  private nominalAmperageMax = 20;
  private maxPower = 8;
  private nominalPowerMax = 5;

  voltageChart: any;
  amperageChart: any;
  powerChart: any;

  timerSub: Subscription;

  voltageTranslation: string;
  amperageTranslation: string;
  powerTranslation: string;
  vLabel: string;
  aLabel: string;
  kwLabel: string;

  constructor(private webSocketService: WebSocketService,
    private translate: TranslateService) {
    this.initCharts();
    translate.onLangChange.subscribe(async () => {
      await this.processTranslations();
    });
  }

  async processTranslations() {
    await this.translateWords();
    this.voltageChart.data = [
      [this.voltageTranslation, { v: this.voltage, f: `${this.voltage} ${this.vLabel}` }],
    ];
    this.amperageChart.data = [
      [this.amperageTranslation, { v: this.amperage, f: `${this.amperage} ${this.aLabel}` }],
    ];
    this.powerChart.data = [
      [this.powerTranslation, { v: this.power, f: `${this.power} ${this.kwLabel}` }],
    ];
  }

  async translateWords() {
    this.voltageTranslation = await firstValueFrom(this.translate.get('LIVE_DATA.VOLTAGE'));
    this.vLabel = await firstValueFrom(this.translate.get('LIVE_DATA.V'));
    this.amperageTranslation = await firstValueFrom(this.translate.get('LIVE_DATA.AMPERAGE'));
    this.aLabel = await firstValueFrom(this.translate.get('LIVE_DATA.A'));
    this.powerTranslation = await firstValueFrom(this.translate.get('LIVE_DATA.POWER'));
    this.kwLabel = await firstValueFrom(this.translate.get('LIVE_DATA.KW'));
  }

  async initCharts() {
    await this.translateWords();
    this.voltageChart = {
      type: "Gauge",
      data: [
        [this.voltageTranslation, { v: this.voltage, f: `${this.voltage} ${this.vLabel}` }],
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

    this.amperageChart = {
      type: "Gauge",
      data: [
        [this.amperageTranslation, { v: this.amperage, f: `${this.amperage} ${this.aLabel}` }],
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

    this.powerChart = {
      type: "Gauge",
      data: [
        [this.powerTranslation, { v: this.power, f: `${this.power} ${this.kwLabel}` }],
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
    this.voltage = Math.round(data.voltage);
    this.voltageChart.data = [
      [this.voltageTranslation, { v: this.voltage, f: `${this.voltage} ${this.vLabel}` }],
    ];
    this.amperage = Math.round(data.amperage * 10) / 10;
    this.amperageChart.data = [
      [this.amperageTranslation, { v: this.amperage, f: `${this.amperage} ${this.aLabel}` }],
    ];
    this.power = Math.round(data.power * 10) / 10;
    this.powerChart.data = [
      [this.powerTranslation, { v: this.power, f: `${this.power} ${this.kwLabel}` }],
    ];
  }

}
