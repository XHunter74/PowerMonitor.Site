import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISensorsDataModel } from '../models/sensors-data.model';
import { WebSocketService } from '../services/websocket.service';
import { Observable, Subscription } from 'rxjs';
import { interval } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';
import { ChartsConstants } from '../constants';
import { ChartsBuilder } from './charts-builder';


@Component({
  selector: 'app-live-data',
  templateUrl: './live-data.component.html',
  styleUrls: ['./live-data.component.css']
})


export class LiveDataComponent implements OnInit, OnDestroy {

  private voltage = ChartsConstants.voltageChart.defaultVoltage;
  private amperage = ChartsConstants.amperageChart.defaultAmperage;
  private power = ChartsConstants.powerChart.defaultPower;

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
  sensorsData$: Observable<ISensorsDataModel>;
  dataSubscription: Subscription;

  constructor(private webSocketService: WebSocketService,
    private translate: TranslateService) {
    this.initCharts();
    translate.onLangChange.subscribe(() => {
      this.processTranslations();
    });
    this.sensorsData$ = this.webSocketService.getSensorsData();
    this.dataSubscription = this.sensorsData$.subscribe((data: ISensorsDataModel) => {
      this.updateGaugeIndicators(data);
    });
  }

  processTranslations() {
    this.translateWords().subscribe(() => {
      this.voltageChart.data = [
        [this.voltageTranslation, { v: this.voltage, f: `${this.voltage} ${this.vLabel}` }],
      ];
      this.amperageChart.data = [
        [this.amperageTranslation, { v: this.amperage, f: `${this.amperage} ${this.aLabel}` }],
      ];
      this.powerChart.data = [
        [this.powerTranslation, { v: this.power, f: `${this.power} ${this.kwLabel}` }],
      ];
    });
  }

  translateWords() {
    return this.translate.get(["LIVE_DATA.VOLTAGE", "LIVE_DATA.V", "LIVE_DATA.AMPERAGE", "LIVE_DATA.A", "LIVE_DATA.POWER", "LIVE_DATA.KW"])
      .pipe(tap(translations => {
        this.voltageTranslation = translations["LIVE_DATA.VOLTAGE"];
        this.vLabel = translations["LIVE_DATA.V"];
        this.amperageTranslation = translations["LIVE_DATA.AMPERAGE"];
        this.aLabel = translations["LIVE_DATA.A"];
        this.powerTranslation = translations["LIVE_DATA.POWER"];
        this.kwLabel = translations["LIVE_DATA.KW"];
      }));
  }

  initCharts() {
    this.translateWords().subscribe(() => {
      this.voltageChart = ChartsBuilder
        .buildVoltageChart(this.voltageTranslation, this.voltage, this.vLabel);

      this.amperageChart = ChartsBuilder
        .buildAmperageChart(this.amperageTranslation, this.amperage, this.aLabel);

      this.powerChart = ChartsBuilder
        .buildPowerChart(this.powerTranslation, this.power, this.kwLabel);
    });
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
    }
  }

  ngOnDestroy(): void {
    this.webSocketService.closeSensorsData();
    this.timerSub.unsubscribe();
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    if (this.sensorsData$) {
      this.sensorsData$ = null;
    }
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
