import { Injectable, Inject } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ISensorsDataModel } from '../models/sensors-data.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class WebSocket extends Socket {

    constructor(@Inject('BASE_URL') baseUrl: string) {
        baseUrl = baseUrl.replace('api/', '');
        super({ url: baseUrl, options: {} });
    }

}

@Injectable()
export class WebSocketService {

    private socket: WebSocket;

    constructor(private webSocket: WebSocket) {
    }

    sendMessage(message: string, data?: any) {
        this.webSocket.emit(message, data);
    }

    startGettingSensorsData() {
        if (!this.isConnected) {
            this.openServer();
        }
        this.sendMessage('sensors-data');
    }

    openServer() {
        this.socket = this.webSocket.connect();
    }

    sensorsData(): Observable<ISensorsDataModel> {
        var data = this.webSocket.fromEvent('sensors-data')
            .pipe(map((data: ISensorsDataModel) => {
                data.voltage = Math.round(data.voltage);
                data.amperage = Math.round(data.amperage * 10) / 10;
                data.power = Math.round(data.voltage * data.amperage / 1000 * 10) / 10;
                return data;
            }));
        return data;
    }

    closeSensorsData() {
        this.sendMessage('close-sensors-data');
        this.webSocket.disconnect();
    }

    get isConnected(): boolean {
        return this.socket && this.socket.connected;
    }

}
