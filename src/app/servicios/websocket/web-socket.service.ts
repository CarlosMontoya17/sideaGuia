import { Injectable, EventEmitter, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observer, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

@Output() outEven: EventEmitter<any> = new EventEmitter(); 

  constructor(private socket: Socket) { }

  init() {
    this.socket.emit("reqTokenToServer", null);
  }

  public onMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('responseTokenToClients', (data) => observer.next(data));
    });
  }
}