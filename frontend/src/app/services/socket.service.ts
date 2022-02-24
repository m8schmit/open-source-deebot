import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}

  public listenToEvent(messageType: string): Observable<any> {
    return this.socket.fromEvent(messageType);
  }

  public dispatch(messageType: string, payload: any) {
    console.log('dispatch', messageType, ' with ', payload);
    this.socket.emit(messageType, payload);
  }
}
