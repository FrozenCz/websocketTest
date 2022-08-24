import {Injectable} from '@angular/core';
import {io, Socket} from "socket.io-client";
import {Observable, share, Subject, Subscription, takeUntil, tap, timer} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WsSocketioService {
  socket!: Socket;
  lastUpdateVersion: number = 0;
  unsubscribe: Subject<void> = new Subject<void>();
  private connectionActive = false;

  constructor() {
    document.addEventListener('visibilitychange', (event) => {
      if (document.hidden && this.socket) {
        console.log('not visible');
        this.closeConnection();
      } else if (!this.connectionActive) {
          console.log('now is visible')
          this.openConnection();
      }
    });
    this.openConnection();
  }

  sendMessage() {
    this.socket.emit('msgToServer',)
  }

  closeConnection() {
    this.socket.close();
    this.socket.off('msgToClient');
    this.connectionActive = false;
  }

  openConnection() {
    this.unsubscribe.next();
    if (this.socket) {
      this.socket.off('msgToClient');
    }
    this.socket = io('http://localhost:3000');
    this.subscribeToServer().pipe(takeUntil(this.unsubscribe)).subscribe((result) => {
      console.log('im here' + result)
    });
  }

  reload(): void {
    console.warn('reloading ' + Math.random(), this.lastUpdateVersion);
  }

  subscribeToServer() {
    return new Observable(observer => {
      this.socket.on('msgToClient', msg => {
        if (+msg['previousUpdateVersion'] !== this.lastUpdateVersion) {
          this.reload();
          this.lastUpdateVersion = +msg['actualUpdateVersion'];
        } else {
          this.lastUpdateVersion = +msg['actualUpdateVersion']
        }
        console.log('whhh?');
        observer.next(msg.data[0].msg);
      })
    }).pipe(
      tap(() => {
        this.connectionActive = true;
      }),
      share()
    )
  }

}
