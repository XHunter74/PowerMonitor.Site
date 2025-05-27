import { TestBed } from '@angular/core/testing';
import { WebSocketService, WebSocket } from '../../src/app/services/websocket.service';
import { ISensorsDataModel } from '../../src/app/models/sensors-data.model';
import { of } from 'rxjs';

// Mock WebSocket class
class MockWebSocket {
    connected = false;
    emit = jest.fn();
    connect = jest.fn(() => this);
    disconnect = jest.fn();
    fromEvent = jest.fn();
}

describe('WebSocketService', () => {
    let service: WebSocketService;
    let mockWebSocket: MockWebSocket;

    beforeEach(() => {
        mockWebSocket = new MockWebSocket();
        TestBed.configureTestingModule({
            providers: [WebSocketService, { provide: WebSocket, useValue: mockWebSocket }],
        });
        service = TestBed.inject(WebSocketService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('sendMessage', () => {
        it('should call emit on WebSocket', () => {
            service.sendMessage('test-message', { foo: 'bar' });
            expect(mockWebSocket.emit).toHaveBeenCalledWith('test-message', { foo: 'bar' });
        });
    });

    describe('startGettingSensorsData', () => {
        it('should open server if not connected and send sensors-data', () => {
            jest.spyOn(service, 'openServer');
            mockWebSocket.connected = false;
            (service as any).socket = mockWebSocket; // ensure socket is set for isConnected logic
            service.startGettingSensorsData();
            expect(service.openServer).toHaveBeenCalled();
            expect(mockWebSocket.emit).toHaveBeenCalledWith('sensors-data', undefined);
        });

        it('should not open server if already connected', () => {
            jest.spyOn(service, 'openServer');
            mockWebSocket.connected = true;
            (service as any).socket = mockWebSocket; // ensure socket is set for isConnected logic
            service.startGettingSensorsData();
            expect(service.openServer).not.toHaveBeenCalled();
            expect(mockWebSocket.emit).toHaveBeenCalledWith('sensors-data', undefined);
        });
    });

    describe('openServer', () => {
        it('should call connect on WebSocket and set socket', () => {
            service.openServer();
            expect(mockWebSocket.connect).toHaveBeenCalled();
            expect((service as any).socket).toBe(mockWebSocket);
        });
    });

    describe('sensorsData', () => {
        it('should return mapped observable from WebSocket', (done) => {
            const input: ISensorsDataModel = {
                voltage: 221.7,
                amperage: 5.26,
                power: 0,
                created: new Date(),
                powerFactor: 0,
            };
            mockWebSocket.fromEvent.mockReturnValue(of(input));
            service.sensorsData().subscribe((result) => {
                expect(result.voltage).toBe(222);
                expect(result.amperage).toBe(5.3);
                expect(result.power).toBeCloseTo(1.2, 1); // (222*5.3/1000) rounded to 1 decimal
                done();
            });
        });
    });

    describe('closeSensorsData', () => {
        it('should send close-sensors-data and disconnect', () => {
            service.closeSensorsData();
            expect(mockWebSocket.emit).toHaveBeenCalledWith('close-sensors-data', undefined);
            expect(mockWebSocket.disconnect).toHaveBeenCalled();
        });
    });

    describe('isConnected', () => {
        it('should return true if socket exists and connected', () => {
            (service as any).socket = { connected: true };
            expect(service.isConnected).toBe(true);
        });
        it('should return false if socket does not exist', () => {
            (service as any).socket = undefined;
            expect(service.isConnected).toBe(false);
        });
        it('should return false if socket exists but not connected', () => {
            (service as any).socket = { connected: false };
            expect(service.isConnected).toBe(false);
        });
    });
});
