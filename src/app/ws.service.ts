import {Injectable} from '@angular/core';
import { QueueingSubject } from 'queueing-subject';
import makeWebSocketObservable, {GetWebSocketResponses, normalClosureMessage} from 'rxjs-websockets';
import {Observable, share, Subscription, switchMap} from 'rxjs';

export type WebSocketPayload = string | ArrayBuffer | Blob;

@Injectable({
  providedIn: 'root'
})
export class wsService {
  private messagesSubscription!: Subscription;


  constructor() {
    // setTimeout(closeWebsocket, 2000)
  }

  closeWebsocket() {
    // this also caused the websocket connection to be closed
    this.messagesSubscription.unsubscribe()
  }

  startWs(): void {
    const input$ = new QueueingSubject<string>()
// queue up a request to be sent when the websocket connects
    input$.next('ws')
// create the websocket observable, does *not* open the websocket connection
    const socket$ = makeWebSocketObservable('ws://localhost:3000/socket.io')
    const messages$: Observable<WebSocketPayload> = socket$.pipe(
      // the observable produces a value once the websocket has been opened
      switchMap((getResponses: GetWebSocketResponses) => {
        console.log('websocket opened')
        return getResponses(input$)
      }),
      share(),
    )

    this.messagesSubscription = messages$.subscribe(
      (message: any) => {
        console.log('received message:', message)
        // respond to server
        input$.next('i got your message')
      },
      (error: Error) => {
        const { message } = error
        if (message === normalClosureMessage) {
          console.log('server closed the websocket connection normally')
        } else {
          console.log('socket was disconnected due to error:', message)
        }
      },
      () => {
        // The clean termination only happens in response to the last
        // subscription to the observable being unsubscribed, any
        // other closure is considered an error.
        console.log('the connection was closed in response to the user')
      },
    )
  }
}
