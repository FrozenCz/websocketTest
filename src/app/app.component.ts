import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {wsService} from './ws.service';
import {WsSocketioService} from './ws.socketio.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  serverUrl = 'http://127.0.0.1:3000';
  title = 'websocketTest';
  result$: any;

  constructor(private httpClient: HttpClient, private wsService: wsService, private socketIo: WsSocketioService) {
    // this.message$ = this.socketIo.onNewMessage();
  }

  fetchFromServer(): void {
    this.result$ = this.httpClient.get(this.serverUrl);
  }

  startws(): void {
    // this.message$ = this.socketIo.onNewMessage();
    // this.fetchFromServer();
    // this.socketIo.sendMessage();
    // this.wsService.startWs();
  }

  stopws(): void {
    this.socketIo.closeConnection();
    // this.wsService.closeWebsocket();
  }





}
