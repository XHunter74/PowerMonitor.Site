import { Injectable, Inject } from '@angular/core';
import { Socket } from 'ng-socket-io';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { ISensorsDataModel } from '../models/sensors-data.model';
import { Observer } from 'rxjs';

@Injectable()
export class WebSocket extends Socket {

    constructor(@Inject('BASE_URL') baseUrl) {
        super({ url: baseUrl, options: {} });
    }

}

@Injectable()
export class WebSocketService {

    constructor(private webSocket: WebSocket) {
    }

    sendMessage(message: string, data?: any) {
        this.webSocket.emit(message, data);
    }

    getSensorsData(): Observable<ISensorsDataModel> {
        return Observable.create((observer: Observer<ISensorsDataModel>) => {
            this.webSocket.on('sensors-data', (data: ISensorsDataModel) => {
                const sensorData = <ISensorsDataModel>data;
                observer.next(sensorData);
            });
        });
    }

    closeSensorsData() {
        this.sendMessage('close-sensors-data');
        this.webSocket.disconnect();
    }

}
