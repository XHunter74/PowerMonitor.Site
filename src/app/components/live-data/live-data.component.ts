import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISensorsDataModel } from '../../models/sensors-data.model';
import { WebSocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs/operators';
import { ChartsConstants, Constants } from '../../shared/constants';
import { ChartsBuilder } from './charts-builder';

@Component({
    selector: 'app-live-data',
    templateUrl: './live-data.component.html',
    styleUrls: ['./live-data.component.css'],
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
    dataSubscription: Subscription;

    constructor(
        private webSocketService: WebSocketService,
        private translate: TranslateService,
    ) {
        this.initCharts();
        translate.onLangChange.subscribe(() => {
            this.processTranslations();
        });
        this.dataSubscription = this.webSocketService
            .sensorsData()
            .subscribe((data: ISensorsDataModel) => {
                this.updateGaugeIndicators(data);
            });
    }

    processTranslations() {
        this.translateWords().subscribe(() => {
            this.voltageChart.data = [
                [this.voltageTranslation, { v: this.voltage, f: `${this.voltage} ${this.vLabel}` }],
            ];
            this.amperageChart.data = [
                [
                    this.amperageTranslation,
                    { v: this.amperage, f: `${this.amperage} ${this.aLabel}` },
                ],
            ];
            this.powerChart.data = [
                [this.powerTranslation, { v: this.power, f: `${this.power} ${this.kwLabel}` }],
            ];
        });
    }

    translateWords() {
        return this.translate
            .get([
                'LIVE_DATA.VOLTAGE',
                'LIVE_DATA.V',
                'LIVE_DATA.AMPERAGE',
                'LIVE_DATA.A',
                'LIVE_DATA.POWER',
                'LIVE_DATA.KW',
            ])
            .pipe(
                tap((translations) => {
                    this.voltageTranslation = translations['LIVE_DATA.VOLTAGE'];
                    this.vLabel = translations['LIVE_DATA.V'];
                    this.amperageTranslation = translations['LIVE_DATA.AMPERAGE'];
                    this.aLabel = translations['LIVE_DATA.A'];
                    this.powerTranslation = translations['LIVE_DATA.POWER'];
                    this.kwLabel = translations['LIVE_DATA.KW'];
                }),
            );
    }

    initCharts() {
        this.translateWords().subscribe(() => {
            this.voltageChart = ChartsBuilder.buildVoltageChart(
                this.voltageTranslation,
                this.voltage,
                this.vLabel,
            );

            this.amperageChart = ChartsBuilder.buildAmperageChart(
                this.amperageTranslation,
                this.amperage,
                this.aLabel,
            );

            this.powerChart = ChartsBuilder.buildPowerChart(
                this.powerTranslation,
                this.power,
                this.kwLabel,
            );
        });
    }

    ngOnInit(): void {
        this.initSocketConnection();
        this.timerSub = interval(Constants.CheckSocketConnectionInterval).subscribe(() => {
            this.initSocketConnection();
        });
    }

    initSocketConnection() {
        if (!this.webSocketService.isConnected) {
            this.webSocketService.startGettingSensorsData();
        }
    }

    ngOnDestroy(): void {
        this.webSocketService.closeSensorsData();
        this.timerSub.unsubscribe();
        if (this.dataSubscription) {
            this.dataSubscription.unsubscribe();
        }
    }

    updateGaugeIndicators(data: ISensorsDataModel) {
        this.voltage = data.voltage;
        this.amperage = data.amperage;
        this.power = data.power;
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
}
