import { Injectable, Inject } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs/Observable';
import { ISensorsDataModel } from '../models/sensors-data.model';
import { map } from 'rxjs/operators';

@Injectable()
export class WebSocket extends Socket {

    constructor(@Inject('BASE_URL') baseUrl: string) {
        baseUrl = baseUrl.replace('api/', '');
        super({ url: baseUrl, options: {} });
    }

}

@Injectable()
export class WebSocketService {

    private socket;

    constructor(private webSocket: WebSocket) {
    }

    sendMessage(message: string, data?: any) {
        this.webSocket.emit(message, data);
    }

    openServer() {
        this.socket = this.webSocket.connect();
    }

    getSensorsData(): Observable<ISensorsDataModel> {
        var data = this.webSocket.fromEvent('sensors-data')
            .pipe(map((data: ISensorsDataModel) => data));
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
