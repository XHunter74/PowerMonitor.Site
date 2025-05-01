import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { LiveDataComponent } from '../components/live-data/live-data.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { SocketIoModule } from 'ngx-socket-io';
import { WebSocketService, WebSocket } from '../services/websocket.service';

const routes: Routes = [
    {
        path: '',
        component: LiveDataComponent,
    }
];

@NgModule({
    declarations: [
        LiveDataComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        GoogleChartsModule,
        TranslateModule.forChild(),
        SocketIoModule,
    ],
    providers: [
        WebSocket,
        WebSocketService,
    ],
})
export class LiveDataModule { }