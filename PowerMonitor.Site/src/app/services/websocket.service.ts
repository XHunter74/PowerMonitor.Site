import { Injectable, NgModule, Inject, Optional } from '@angular/core';
import { Socket } from 'ng-socket-io';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

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

    getSensorsData() {
        return Observable.create(observer => {
            this.webSocket.on('sensors-data', msg => {
                observer.next(msg);
            });
        });
    }

    // sendMessage(msg: string) {
    //     this.socket.emit('sendMessage', { message: msg });
    // }

    // onNewMessage() {
    //     return Observable.create(observer => {
    //         this.socket.on('message', msg => {
    //             observer.next(msg);
    //         });
    //     });
    // }
}
