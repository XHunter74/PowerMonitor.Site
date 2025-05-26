// Mocks and jest.mock must be defined before importing the component under test
const mockConstants = { CheckSocketConnectionInterval: 10000 };
const mockChartsConstants = {
    voltageChart: { defaultVoltage: 220 },
    amperageChart: { defaultAmperage: 10 },
    powerChart: { defaultPower: 2 },
};

const mockChartsBuilder = {
    buildVoltageChart: jest.fn(() => ({ data: [] })),
    buildAmperageChart: jest.fn(() => ({ data: [] })),
    buildPowerChart: jest.fn(() => ({ data: [] })),
};

jest.mock('../../../src/app/shared/constants', () => ({
    Constants: mockConstants,
    ChartsConstants: mockChartsConstants,
}));

jest.mock('../../../src/app/components/live-data/charts-builder', () => ({
    ChartsBuilder: mockChartsBuilder,
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LiveDataComponent } from '../../../src/app/components/live-data/live-data.component';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { WebSocketService } from '../../../src/app/services/websocket.service';

// Mocks
class MockWebSocketService {
    isConnected = false;
    sensorsData = jest.fn(() => of({ voltage: 220, amperage: 10, power: 2 }));
    startGettingSensorsData = jest.fn();
    closeSensorsData = jest.fn();
}

describe('LiveDataComponent', () => {
    let component: LiveDataComponent;
    let fixture: ComponentFixture<LiveDataComponent>;
    let webSocketService: WebSocketService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LiveDataComponent],
            imports: [TranslateModule.forRoot()],
            providers: [
                { provide: WebSocketService, useClass: MockWebSocketService },
                { provide: 'ChartsBuilder', useValue: mockChartsBuilder },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(LiveDataComponent);
        component = fixture.componentInstance;
        webSocketService = TestBed.inject(WebSocketService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call startGettingSensorsData if not connected', () => {
        component.initSocketConnection();
        expect(webSocketService.startGettingSensorsData).toHaveBeenCalled();
    });

    it('should call closeSensorsData and unsubscribe on destroy', () => {
        component.timerSub = { unsubscribe: jest.fn() } as any;
        component.dataSubscription = { unsubscribe: jest.fn() } as any;
        component.ngOnDestroy();
        expect(webSocketService.closeSensorsData).toHaveBeenCalled();
        expect(component.timerSub.unsubscribe).toHaveBeenCalled();
        expect(component.dataSubscription.unsubscribe).toHaveBeenCalled();
    });

    it('should update gauge indicators', () => {
        component.voltageChart = { data: [] };
        component.amperageChart = { data: [] };
        component.powerChart = { data: [] };
        component.voltageTranslation = 'Voltage';
        component.vLabel = 'V';
        component.amperageTranslation = 'Amperage';
        component.aLabel = 'A';
        component.powerTranslation = 'Power';
        component.kwLabel = 'kW';
        const data = { voltage: 230, amperage: 12, power: 3 };
        component.updateGaugeIndicators(data as any);
        expect(component.voltageChart.data[0][1].v).toBe(230);
        expect(component.amperageChart.data[0][1].v).toBe(12);
        expect(component.powerChart.data[0][1].v).toBe(3);
    });
});
