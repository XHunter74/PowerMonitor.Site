import { Injectable, NgModule, Inject } from '@angular/core';
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

    sendMessage(msg: string) {
        this.webSocket.emit('message', msg);
    }

    getMessage() {
        return Observable.create(observer => {
            this.webSocket.on('message', msg => {
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
